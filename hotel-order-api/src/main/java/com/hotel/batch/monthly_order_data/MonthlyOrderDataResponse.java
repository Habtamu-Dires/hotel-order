package com.hotel.batch.monthly_order_data;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record MonthlyOrderDataResponse(
        Integer year,
        String month,
        Integer totalOrder,
        BigDecimal totalTransaction
) {
}
