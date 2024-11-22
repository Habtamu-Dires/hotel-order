package com.hotel.order;

import com.hotel.batch.daily_average_order.DailyAverageOrder;
import com.hotel.batch.daily_average_order.DailyAverageOrderMapper;
import com.hotel.batch.daily_average_order.DailyAverageOrderRepository;
import com.hotel.batch.daily_average_order.DailyAverageOrderResponse;
import com.hotel.batch.day_of_of_the_week.DayOfTheWeekAnalysisMapper;
import com.hotel.batch.day_of_of_the_week.DayOfTheWeekAnalysisRepository;
import com.hotel.batch.day_of_of_the_week.DayOfTheWeekAnalysisResponse;
import com.hotel.batch.monthly_order_data.MonthlyOrderDataRepository;
import com.hotel.batch.monthly_order_data.MonthlyOrderDataResponse;
import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequency;
import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequencyRepository;
import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequencyResponse;
import com.hotel.common.IdResponse;
import com.hotel.common.PageResponse;
import com.hotel.order_detail.OrderDetail;
import com.hotel.order_detail.OrderDetailService;
import com.hotel.location.OrderLocation;
import com.hotel.location.OrderLocationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemOrderService {

    private final ItemOrderRepository repository;
    private final ItemOrderMapper mapper;
    private final OrderLocationService locationService;
    private final OrderDetailService orderDetailService;
    private final MonthlyOrderDataRepository monthlyOrderDataRepository;
    private final OrderedItemsFrequencyRepository orderedItemsFrequencyRepository;
    private final DayOfTheWeekAnalysisRepository dayOfTheWeekAnalysisRepository;
    private final DailyAverageOrderRepository dailyAverageOrderRepository;

    //save order
    @Transactional
    public IdResponse createItemOrder(ItemOrderRequest request) {
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
        String id = repository.save(order).getId().toString();
        return new IdResponse(id);
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
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CHEF","ROLE_BARISTA"})
    public void updateStatus(String orderId, OrderStatus status) {
        ItemOrder order = this.findById(orderId);
        order.setOrderStatus(status);
        repository.save(order);
    }

    // get all item orders
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CHEF","ROLE_BARISTA"})
    public List<ItemOrderResponse> getAllItemOrders() {
        return repository.findAll().stream()
                .map(mapper::toItemOrderResponse)
                .toList();
    }

    // get all pending orders
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CHEF","ROLE_BARISTA"})
    public List<ItemOrderResponse> getPendingOrders() {
        return repository.findPendingOrders().stream()
                 .map(mapper::toItemOrderResponse)
                 .toList();

    }

    // get active (not completed nor canceled) orders
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CHEF","ROLE_BARISTA"})
    public List<ItemOrderResponse> getActiveOrders() {
        return  repository.findActiveOrders().stream()
                .map(mapper::toItemOrderResponse)
                .toList();
    }

    // get ready orders
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CHEF","ROLE_BARISTA"})
    public List<ItemOrderResponse> getReadyOrders() {
        return repository.findReadyOrders().stream()
                .map(mapper::toItemOrderResponse)
                .toList();
    }

    // get OnProcess orders
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CHEF"})
    public List<ItemOrderResponse> getOnProcessOrders() {
        return repository.findOnProcessOrders().stream()
                .map(mapper::toItemOrderResponse)
                .toList();
    }

    // get served orders
    @Secured({"ROLE_ADMIN","ROLE_WAITER","ROLE_CASHIER"})
    public List<ItemOrderResponse> getServedOrders() {
        return repository.findAllServedOrders().stream()
                .map(mapper::toItemOrderResponse)
                .toList();
    }

    // get orders by location
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public List<ItemOrderResponse> getOrdersByLocationId(String locationId) {
        OrderLocation location = locationService.findOrderLocationById(locationId);
        return repository.findOrdersByLocationId(location.getId()).stream()
                .map(mapper::toItemOrderResponse).toList();
    }

    // -------------------------admin-----------------------------------------------//

    // get completed orders specific date-time , per day/ week .
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public List<ItemOrderResponse> getCompletedOrdersAfter(LocalDateTime dateTime) {
        return repository.findCompletedOrdersAfter(dateTime).stream()
                .map(mapper::toItemOrderResponse).toList();
    }

    // total number of completed orders after a date-time
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Integer getTotalNumberOfCompletedOrdersAfter(LocalDateTime dateTime) {
        return repository.findNumberOfCompletedOrdersAfter(dateTime);
    }

    // total transaction after a date-time.
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public BigDecimal getTotalTransactionAfter(LocalDateTime dateTime) {
       return repository.findCompletedOrdersAfter(dateTime).stream()
                 .map(ItemOrder::getTotalPrice)
                 .reduce(BigDecimal.ZERO,BigDecimal::add);
    }

    // top ordered Item of the day
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<OrderedItemsFrequencyResponse> getTopOrderedItemsOfTheDay() {

             return repository.findCompletedOrdersAfter(LocalDateTime.now())
                .stream()
                .flatMap(order -> order.getOrderDetails().stream())
                .collect(Collectors.groupingBy(
                                detail -> detail.getItem().getName(),
                                Collectors.counting()
                        )
                )
                .entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .map(entry ->
                        OrderedItemsFrequencyResponse.builder()
                        .frequency(entry.getValue().intValue())
                        .itemName(entry.getKey())
                        .build()
                )
                .toList();
    }
    // top ordered items in the past 30 days.
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PageResponse<OrderedItemsFrequencyResponse> getTopOrderedItemsOfPst30Days(int page, int size){

        Pageable pageable = PageRequest.of(page,size,Sort.by("frequency"));
        Page<OrderedItemsFrequency> topOrderedItems = orderedItemsFrequencyRepository.findAll(pageable);

        List<OrderedItemsFrequencyResponse> list = topOrderedItems
                .stream()
                .map(orderedItem ->
                        OrderedItemsFrequencyResponse.builder()
                                .itemName(orderedItem.getItem().getName())
                                .frequency(orderedItem.getFrequency())
                                .build()
                )
                .toList();

        return  PageResponse.<OrderedItemsFrequencyResponse>builder()
                .content(list)
                .number(topOrderedItems.getNumber())
                .totalElements(topOrderedItems.getNumberOfElements())
                .totalPages(topOrderedItems.getTotalPages())
                .first(topOrderedItems.isFirst())
                .last(topOrderedItems.isLast())
                .empty(topOrderedItems.isEmpty())
                .build();

    }

    // daily average number of transactions for past 7 days
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
