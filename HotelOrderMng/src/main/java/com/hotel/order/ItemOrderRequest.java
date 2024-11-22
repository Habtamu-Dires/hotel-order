package com.hotel.order;

import com.hotel.order_detail.OrderDetailRequest;
import com.hotel.location.LocationResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record ItemOrderRequest(
        String id,
        @NotNull(message = "Total price is mandatory")
        BigDecimal totalPrice,
        @NotNull(message = "OrderType  is mandatory")
        String orderType,
        @Size(min = 1, message = "At least one order detail is mandatory")
        List<OrderDetailRequest> orderDetails,
        @NotBlank(message = "Location Id is mandatory")
        String locationId,
        String note
) {
}
