package com.hotel.order;

import com.hotel.order_detail.OrderDetailRequest;
import com.hotel.location.OrderLocationResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record ItemOrderRequest(
        String id,
        @NotNull(message = "Total price is mandatory")
        BigDecimal totalPrice,
        @NotNull(message = "OrderType  is mandatory")
        OrderType orderType,
        @NotNull(message = "OrderDetail is mandatory")
        List<OrderDetailRequest> orderDetails,
        OrderLocationResponse location,
        @NotBlank(message = "Location Id is mandatory")
        String locationId,
        String note
) {
}
