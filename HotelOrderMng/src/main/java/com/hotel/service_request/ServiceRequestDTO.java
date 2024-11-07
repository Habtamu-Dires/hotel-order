package com.hotel.service_request;

import com.hotel.location.OrderLocationResponse;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ServiceRequestDTO(
        String id,
        String locationId,
        OrderLocationResponse location,
        ServiceStatus serviceStatus,
        ServiceType serviceType,
        LocalDateTime createdAt,
        LocalDateTime completedAt
) {
}
