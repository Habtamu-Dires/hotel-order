package com.hotel.order_detail;

import lombok.Builder;

@Builder
public record OrderDetailRequest(
        String id,
        String itemId,
        Integer quantity,
        String orderId,
        String type,
        String note,
        DetailStatus status
) {
}
