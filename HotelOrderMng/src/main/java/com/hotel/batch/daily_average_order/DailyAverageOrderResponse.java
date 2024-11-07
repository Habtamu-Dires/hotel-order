package com.hotel.batch.daily_average_order;

import lombok.Builder;

@Builder
public record DailyAverageOrderResponse(
        double averageOrder,
        double averageTransaction
) {}
