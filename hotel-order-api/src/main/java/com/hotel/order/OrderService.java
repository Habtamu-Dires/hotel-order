package com.hotel.order;

import com.hotel.batch.daily_average_order.DailyAverageOrder;
import com.hotel.batch.daily_average_order.DailyAverageOrderMapper;
import com.hotel.batch.daily_average_order.DailyAverageOrderRepository;
import com.hotel.batch.daily_average_order.DailyAverageOrderResponse;
import com.hotel.batch.day_of_the_week.DayOfTheWeekAnalysisMapper;
import com.hotel.batch.day_of_the_week.DayOfTheWeekAnalysisRepository;
import com.hotel.batch.day_of_the_week.DayOfTheWeekAnalysisResponse;
import com.hotel.batch.monthly_order_data.MonthlyOrderDataRepository;
import com.hotel.batch.monthly_order_data.MonthlyOrderDataResponse;
import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequency;
import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequencyRepository;
import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequencyResponse;
import com.hotel.common.IdResponse;
import com.hotel.order_detail.OrderDetail;
import com.hotel.order_detail.OrderDetailResponse;
import com.hotel.order_detail.OrderDetailService;
import com.hotel.location.OrderLocation;
import com.hotel.location.OrderLocationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository repository;
    private final OrderMapper mapper;
    private final OrderLocationService locationService;
    private final OrderDetailService orderDetailService;
    private final MonthlyOrderDataRepository monthlyOrderDataRepository;
    private final OrderedItemsFrequencyRepository orderedItemsFrequencyRepository;
    private final DayOfTheWeekAnalysisRepository dayOfTheWeekAnalysisRepository;
    private final DailyAverageOrderRepository dailyAverageOrderRepository;
    private final OrderNotificationService orderNotificationService;

    //save order
    @Transactional
    public IdResponse createItemOrder(OrderRequest request) {
        ItemOrder order = ItemOrder.builder()
                .totalPrice(request.totalPrice())
                .orderType(toOrderTypeEnum(request.orderType()))
                .orderStatus(OrderStatus.PENDING)
                .note(request.note())
                .build();

        if(request.id() == null){ order.setId(UUID.randomUUID()); }
        else { order.setId(UUID.fromString(request.id()));  }

        //location
        OrderLocation location = locationService.findOrderLocationById(request.locationId());
        order.setOrderLocation(location);
        //order details
        ArrayList<OrderDetail> orderDetails = new ArrayList<>();
        request.orderDetails().forEach(detail -> {
            OrderDetail orderDetail = orderDetailService
                    .createOrderDetail(detail,order);

            orderDetails.add(orderDetail);
        });

        order.setOrderDetails(orderDetails);
        ItemOrder savedOrder = repository.save(order);
        // send notification
        orderNotificationService.sendOrderNotification(
                "waiter", mapper.toItemOrderResponse(savedOrder)
        );
        return new IdResponse(savedOrder.getId().toString());
    }

    //convert string to OrderType
    public OrderType toOrderTypeEnum(String type){
        try {
            return OrderType.valueOf(type);
        } catch (Exception e){
            throw new IllegalArgumentException("No such order type");
        }
    }

    // find by id
    private ItemOrder findById(String id){
        return repository.findById(UUID.fromString(id))
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Order with id %d not found ", id)));
    }

    // update order status
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CHEF","ROLE_BARISTA","ROLE_CASHIER"})
    public void updateStatus(String orderId, String status) {
        ItemOrder order = this.findById(orderId);
        OrderStatus orderStatus = convertToOrderStatus(status);
        OrderStatus oldStatus = order.getOrderStatus();
        order.setOrderStatus(orderStatus);
        repository.save(order);
        // send update notification to a waiter
        orderNotificationService.sendOrderNotification(
                "waiter",
                mapper.toItemOrderResponse(order)
        );

//         send update notification to a kds
        if(orderStatus.equals(OrderStatus.VERIFIED) ||
                (oldStatus.equals(OrderStatus.VERIFIED) &&
                        orderStatus.equals(OrderStatus.CANCELED)
                )
        ){
            orderNotificationService.sendOrderNotification(
                    "chef",
                    mapper.toItemOrderResponse(order)
            );
        }

        // send notification to cashier
        if(orderStatus.equals(OrderStatus.BillREQUEST)){
            orderNotificationService.sendOrderNotification(
                    "cashier",
                    mapper.toItemOrderResponse(order)
            );
        }


    }

    //convert string to OrderStatus enum
    public OrderStatus convertToOrderStatus(String status){
        try{
            return OrderStatus.valueOf(status);
        } catch (Exception e){
            throw new IllegalArgumentException("No such OrderStatus");
        }
    }

    // get all item orders
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CHEF","ROLE_BARISTA"})
    public List<OrderResponse> getAllItemOrders() {
        return repository.findAll()
                .stream()
                .map(mapper::toItemOrderResponse)
                .toList();
    }

    // get active (not completed nor canceled) orders
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CHEF","ROLE_BARISTA"})
    public List<OrderResponse> getActiveOrders() {
        return  repository.findActiveOrders().stream()
                .map(mapper::toItemOrderResponse)
                .toList();
    }

    // get orders by status
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CHEF","ROLE_BARISTA","ROLE_CASHIER"})
    public List<OrderResponse> getOrdersByStatus(String status) {
        OrderStatus orderStatus = convertToOrderStatus(status);
        return repository.findOrdersByStatus(orderStatus)
                .stream()
                .sorted(Comparator.comparing(ItemOrder::getCreatedDate))
                .map(mapper::toItemOrderResponse)
                .toList();

    }

    // get verified or onProcess  orders
    @Secured({"ROLE_ADMIN","ROLE_CHEF"})
    public List<OrderResponse> getVerifiedOROnProcessOrders() {
        return repository.findOrdersByStatus(OrderStatus.VERIFIED, OrderStatus.OnPROCESS)
                .stream()
                .sorted(Comparator.comparing(ItemOrder::getCreatedDate))
                .map(order -> {
                    OrderResponse response = mapper.toItemOrderResponse(order);
                    List<OrderDetailResponse> sortedDetailResponse = new ArrayList<>(response.orderDetails());
                    // sort each detail by price
                    sortedDetailResponse.sort(Comparator.comparing(OrderDetailResponse::price));
                    return  OrderResponse.builder()
                            .id(response.id())
                            .totalPrice(response.totalPrice())
                            .orderType(response.orderType())
                            .orderDetails(sortedDetailResponse)
                            .createdDate(response.createdDate())
                            .orderStatus(response.orderStatus())
                            .note(response.note())
                            .location(response.location())
                            .locationId(response.locationId())
                            .build();
                })
                .toList();
    }

    // get orders by location
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public List<OrderResponse> getOrdersByLocationId(String locationId) {
        OrderLocation location = locationService.findOrderLocationById(locationId);
        return repository.findOrdersByLocationId(location.getId()).stream()
                .map(mapper::toItemOrderResponse).toList();
    }

    //get not-completed order by location , date and
    public List<ItemOrder> getNonCompletedOrdersOfTodayByLocation(String locationId){
        UUID id = UUID.fromString(locationId);
        return repository.NonCompletedOrdersOfTodayByLocation(id,LocalDateTime.now().minusDays(1));
    }

    // -------------------------admin-----------------------------------------------//

    // get completed orders specific date-time , per day/ week .
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public List<OrderResponse> getCompletedOrdersAfter(LocalDateTime dateTime) {
        return repository.findCompletedOrdersAfter(dateTime).stream()
                .map(mapper::toItemOrderResponse).toList();
    }

    // total number of completed orders of today
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Integer getTotalNumberOfCompletedOrdersOfToday() {
        LocalDateTime mindNight = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        return repository.findNumberOfCompletedOrdersAfter(mindNight);
    }

    // total transaction of today
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public BigDecimal getTotalTransactionOfToday() {
        LocalDateTime mindNight = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        return repository.findCompletedOrdersAfter(mindNight)
                .stream()
                .map(ItemOrder::getTotalPrice)
                .reduce(BigDecimal.ZERO,BigDecimal::add);
    }

    // top ordered Item of the day
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<OrderedItemsFrequencyResponse> getTopOrderedItemsOfToDay() {
        LocalDateTime mindNight = LocalDateTime.of(LocalDate.now(),LocalTime.MIDNIGHT);
         return repository.findCompletedOrdersAfter(mindNight)
            .stream()
            .flatMap(order -> order.getOrderDetails().stream())
            .collect(Collectors.groupingBy(
                    OrderDetail::getItem,
                    Collectors.summingInt(OrderDetail::getQuantity)
                    )
            )
            .entrySet().stream()
            .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
            .map(entry ->
                    OrderedItemsFrequencyResponse.builder()
                    .imageUrl(entry.getKey().getImageUrl())
                    .frequency(entry.getValue())
                    .price(entry.getKey().getPrice())
                    .itemName(entry.getKey().getName())
                    .build()
            )
            .toList();
    }
    // top ordered items in the past 30 days.
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<OrderedItemsFrequencyResponse> getTopOrderedItemsOfPst30Days(){

        List<OrderedItemsFrequency> freqData = orderedItemsFrequencyRepository.findAll();

        return  freqData
                .stream()
                .sorted(Comparator.comparing(OrderedItemsFrequency::getFrequency,Comparator.reverseOrder()))
                .map(freqOfItem ->
                        OrderedItemsFrequencyResponse.builder()
                                .itemName(freqOfItem.getItem().getName())
                                .imageUrl(freqOfItem.getItem().getImageUrl())
                                .price(freqOfItem.getItem().getPrice())
                                .frequency(freqOfItem.getFrequency())
                                .build()
                )
                .toList();
    }

    // daily average number of orders and transactions for past 7 days
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public DailyAverageOrderResponse getDailyAverageOrders() {
        DailyAverageOrder dailyAverageData = dailyAverageOrderRepository.findById(1)
                .orElseThrow(() -> new EntityNotFoundException("Daily Average Data Not Found"));
        return DailyAverageOrderMapper.toDailyAverageOrderResponse(dailyAverageData);
    }

    // Day of the week average for 28 days
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<DayOfTheWeekAnalysisResponse> getDayOfTheWeekAnalysisAverages() {
        return dayOfTheWeekAnalysisRepository.findAll()
                .stream()
                .map(DayOfTheWeekAnalysisMapper::toDayOfTheWeekResponse)
                .toList();
    }


    // monthly number of orders and total transaction for a year
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<MonthlyOrderDataResponse> getMonthlyOrderDataForYear(Integer year){
        return monthlyOrderDataRepository.getMonthlyOrderDataForYear(year)
                .stream()
                .map(orderData ->
                        MonthlyOrderDataResponse.builder()
                                .year(orderData.getYear())
                                .month(orderData.getMonth())
                                .totalOrder(orderData.getTotalOrder())
                                .totalTransaction(orderData.getTotalTransaction())
                                .build()
                )
                .toList();
    }

}
