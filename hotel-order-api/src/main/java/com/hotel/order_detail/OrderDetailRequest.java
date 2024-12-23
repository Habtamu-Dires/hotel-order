package com.hotel.order_detail;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record OrderDetailRequest(
        String id,
        String itemId,
        Integer quantity,
        BigDecimal price,
        String itemName,
        String orderId,
        String type,
        String note
) {
}
