package com.hotel.order;

import com.hotel.batch.daily_average_order.DailyAverageOrderResponse;
import com.hotel.batch.day_of_of_the_week.DayOfTheWeekAnalysisResponse;
import com.hotel.batch.monthly_order_data.MonthlyOrderDataResponse;
import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequencyResponse;
import com.hotel.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class ItemOrderController {

    private final ItemOrderService service;

    //create new order
    @Tag(name = "orders")
    @PostMapping
    public ResponseEntity<String> createOrder(
            @RequestBody  ItemOrderRequest request
    ){
        return ResponseEntity.ok(service.createItemOrder(request));
    }


    //get active orders
    @Tag(name = "orders")
    @GetMapping("/active")
    public  ResponseEntity<List<ItemOrderResponse>> getActiveOrders(){
        return ResponseEntity.ok(service.getActiveOrders());
    }

    //get pending orders
    @Tag(name = "orders")
    @GetMapping("/pending")
    public ResponseEntity<List<ItemOrderResponse>> getPendingOrders(){
        return ResponseEntity.ok(service.getPendingOrders());
    }

    //get Ready orders
    @Tag(name = "orders")
    @GetMapping("/ready")
    public  ResponseEntity<List<ItemOrderResponse>> getReadyOrders(){
        return ResponseEntity.ok(service.getReadyOrders());
    }

    // get OnProcess orders
    @Tag(name = "orders")
    @GetMapping("/on-process")
    public  ResponseEntity<List<ItemOrderResponse>> getOnProcessOrders(){
        return ResponseEntity.ok(service.getOnProcessOrders());
    }

    // get served orders
    @Tag(name = "orders")
    @GetMapping("/served")
    public  ResponseEntity<List<ItemOrderResponse>> getServedOrders(){
        return ResponseEntity.ok(service.getServedOrders());
    }

    // get all item orders
    @Tag(name = "orders")
    @GetMapping
    public ResponseEntity<List<ItemOrderResponse>> getAllItemOrders(){
        return ResponseEntity.ok(service.getAllItemOrders());
    }


    // get completed orders based on date-time
    @Tag(name = "orders")
    @GetMapping("/completed")
    public ResponseEntity<List<ItemOrderResponse>> getCompletedOrders(
            @RequestParam("date-time") LocalDateTime dateTime
    ){
        return ResponseEntity.ok(service.getCompletedOrdersAfter(dateTime));
    }

    // get order by locationId
    @Tag(name = "orders")
    @GetMapping("/locations/{location-id}")
    public ResponseEntity<List<ItemOrderResponse>> getOrdersByLocation(
            @PathVariable("location-id") String locationId
    ) {
        return ResponseEntity.ok(service.getOrdersByLocationId(locationId));
    }

    // update order status
    @Tag(name = "orders")
    @PutMapping("/update-status/{order-id}")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable("order-id") String orderId,
            @RequestBody OrderStatus newStatus
    ){
        service.updateStatus(orderId,newStatus);
        return ResponseEntity.accepted().build();
    }

    // ------------------------------admin -------------------------------//

    // get total number of completed orders after specific date-time
     @Tag(name = "orders-admin")
     @GetMapping("/completed/number-of-orders-after")
     public ResponseEntity<Integer> getTotalNumberOfOrders(
             @RequestParam("date-time") LocalDateTime dateTime
     ){
        return ResponseEntity.ok(service.getTotalNumberOfCompletedOrdersAfter(dateTime));
     }

    // get total transaction after specific date
    @Tag(name = "orders-admin")
    @GetMapping("/completed/total-transaction-after")
    public ResponseEntity<BigDecimal> getTotalTransaction(
            @RequestParam("date-time") LocalDateTime dateTime
    ){
        return ResponseEntity.ok(service.getTotalTransactionAfter(dateTime));
    }


    // top ordered product of the
    @Tag(name = "orders-admin")
    @GetMapping("/completed/top-ordered-items-of-today")
    public ResponseEntity<List<OrderedItemsFrequencyResponse>> getTopOrderedItemsADay() {
        return ResponseEntity.ok(service.getTopOrderedItemsOfTheDay());
    }

    // top ordered product of the past 30 days
    @Tag(name = "orders-admin")
    @GetMapping("/completed/top-ordered-items-of-past-30days")
    public ResponseEntity<PageResponse<OrderedItemsFrequencyResponse>> getFrequentlyOrderedItemsOfPast30Days(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size",defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(service.getTopOrderedItemsOfPst30Days(page,size));
    }


    // average number of orders and transaction for the past 7 d
    @Tag(name = "orders-admin")
    @GetMapping("/completed/daily-average-order-data-for-past-7days")
    public ResponseEntity<DailyAverageOrderResponse> getDailyAverageOrders(){
         return ResponseEntity.ok(service.getDailyAverageOrders());
    }

    // day of the week, average number of orders for 28 days
    @Tag(name = "admin")
    @Tag(name="orders-admin")
    @GetMapping("/completed/day-of-the-week-average-order-data-for-28days")
    public ResponseEntity<List<DayOfTheWeekAnalysisResponse>> getDayOfTheWeekAverages(){
        return ResponseEntity.ok(service.getDayOfTheWeekAnalysisAverages());
    }


    // monthly number of orders for years
    @Tag(name = "orders-admin")
    @GetMapping("/completed/monthly-order-data")
    public ResponseEntity<List<MonthlyOrderDataResponse>> getMonthlyOrderData(
            @RequestParam("year") Integer year
    ){
        return ResponseEntity.ok(service.getMonthlyOrderDataForYear(year));
    }
}
