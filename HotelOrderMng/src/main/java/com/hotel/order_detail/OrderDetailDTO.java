package com.hotel.order_detail;

import lombok.Builder;

@Builder
public record OrderDetailDTO(
        String id,
        String itemId,
        Integer quantity,
        String orderId,
        String type,
        String note,
        DetailStatus status
) {}
