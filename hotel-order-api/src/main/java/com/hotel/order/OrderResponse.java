package com.hotel.order;

import com.hotel.order_detail.OrderDetailResponse;
import com.hotel.location.LocationResponse;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record OrderResponse(
        String id,
        BigDecimal totalPrice,
        OrderType orderType,
        List<OrderDetailResponse> orderDetails,
        LocationResponse location,
        String locationId,
        String note,
        LocalDateTime createdDate,
        OrderStatus orderStatus
) {}




