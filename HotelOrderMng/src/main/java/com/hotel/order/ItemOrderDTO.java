package com.hotel.order;

import com.hotel.order_detail.OrderDetailDTO;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ItemOrderDTO(
        String orderId,
        BigDecimal totalPrice,
        OrderType orderType,
        List<OrderDetailDTO> orderDetails,
        String locationId,
        String note,
        LocalDateTime createdAt,
        OrderStatus orderStatus
) {}




