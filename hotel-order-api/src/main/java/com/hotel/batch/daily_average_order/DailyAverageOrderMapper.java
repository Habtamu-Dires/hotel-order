package com.hotel.batch.daily_average_order;

public class DailyAverageOrderMapper {

    public static DailyAverageOrderResponse toDailyAverageOrderResponse(
            DailyAverageOrder dailyAverageOrder
    ){
        return DailyAverageOrderResponse.builder()
                .averageOrder(dailyAverageOrder.getTotalOrder() / 7.0)
                .averageTransaction(dailyAverageOrder.getTotalTransaction().doubleValue() / 7.0)
                .build();
    }
}
