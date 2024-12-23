package com.hotel.order;

import com.hotel.batch.daily_average_order.DailyAverageOrderResponse;
import com.hotel.batch.day_of_the_week.DayOfTheWeekAnalysisResponse;
import com.hotel.batch.monthly_order_data.MonthlyOrderDataResponse;
import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequencyResponse;
import com.hotel.common.IdResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    //create new order
    @Tag(name = "orders")
    @PostMapping
    public ResponseEntity<IdResponse> createOrder(
            @RequestBody OrderRequest request
    ){
        return ResponseEntity.ok(service.createItemOrder(request));
    }

    //get active orders
    @Tag(name = "orders")
    @GetMapping("/active")
    public  ResponseEntity<List<OrderResponse>> getActiveOrders(){
        return ResponseEntity.ok(service.getActiveOrders());
    }

    //get orders by status
    @Tag(name = "orders")
    @GetMapping("/by-status")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(
            @RequestParam String status
    ){
        return ResponseEntity.ok(service.getOrdersByStatus(status));
    }


    // get verified And OnProcess orders
    @Tag(name = "orders")
    @GetMapping("/verified-or-onprocess")
    public  ResponseEntity<List<OrderResponse>> getVerifiedOrOnProcessOrders(){
        return ResponseEntity.ok(service.getVerifiedOROnProcessOrders());
    }

    // get all item orders
    @Tag(name = "orders")
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllItemOrders(){
        return ResponseEntity.ok(service.getAllItemOrders());
    }


    // get completed orders based on date-time
    @Tag(name = "orders")
    @GetMapping("/completed")
    public ResponseEntity<List<OrderResponse>> getCompletedOrders(
            @RequestParam("date-time") LocalDateTime dateTime
    ){
        return ResponseEntity.ok(service.getCompletedOrdersAfter(dateTime));
    }

    // get order by locationId
    @Tag(name = "orders")
    @GetMapping("/locations/{location-id}")
    public ResponseEntity<List<OrderResponse>> getOrdersByLocation(
            @PathVariable("location-id") String locationId
    ) {
        return ResponseEntity.ok(service.getOrdersByLocationId(locationId));
    }

    // update order status
    @Tag(name = "orders")
    @PutMapping("/update-status/{order-id}")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable("order-id") String orderId,
            @RequestParam String status
    ){
        service.updateStatus(orderId,status);
        return ResponseEntity.accepted().build();
    }

    // ------------------------------admin -------------------------------//

    // get total number of completed orders after specific date-time
     @Tag(name = "orders-admin")
     @GetMapping("/completed/total-orders-of-today")
     public ResponseEntity<Integer> getTotalNumberOfOrdersOfToday(

     ){
        return ResponseEntity.ok(service.getTotalNumberOfCompletedOrdersOfToday());
     }

    // get total transaction after specific date
    @Tag(name = "orders-admin")
    @GetMapping("/completed/total-transaction-of-today")
    public ResponseEntity<BigDecimal> getTotalTransactionOfToday(){
        return ResponseEntity.ok(service.getTotalTransactionOfToday());
    }


    // top ordered product of the day
    @Tag(name = "orders-admin")
    @GetMapping("/completed/top-ordered-items-of-today")
    public ResponseEntity<List<OrderedItemsFrequencyResponse>> getTopOrderedItemsOfToday() {
        return ResponseEntity.ok(service.getTopOrderedItemsOfToDay());
    }

    // top ordered product of the past 30 days
    @Tag(name = "orders-admin")
    @GetMapping("/completed/top-ordered-items-of-past-30days")
    public ResponseEntity<List<OrderedItemsFrequencyResponse>> getFrequentlyOrderedItemsOfPast30Days() {
        return ResponseEntity.ok(service.getTopOrderedItemsOfPst30Days());
    }

    // average number of orders and transaction for the past 7 days
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
