package com.hotel.order_detail;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record OrderDetailResponse(
        String id,
        String orderId,
        String itemId,
        String itemName,
        BigDecimal price,
        Integer quantity,
        String type,
        String note,
        String status
) {}
