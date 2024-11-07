package com.hotel.order;

import com.hotel.order_detail.OrderDetailResponse;
import com.hotel.location.OrderLocationResponse;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ItemOrderResponse(
        String id,
        BigDecimal totalPrice,
        OrderType orderType,
        List<OrderDetailResponse> orderDetails,
        OrderLocationResponse location,
        String locationId,
        String note,
        LocalDateTime createdAt,
        OrderStatus orderStatus
) {}




