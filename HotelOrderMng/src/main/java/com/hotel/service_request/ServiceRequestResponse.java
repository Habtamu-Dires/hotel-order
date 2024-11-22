package com.hotel.service_request;

import com.hotel.location.LocationResponse;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ServiceRequestResponse(
        String id,
        String locationId,
        LocationResponse location,
        ServiceStatus serviceStatus,
        ServiceType serviceType,
        LocalDateTime createdAt,
        LocalDateTime completedAt
) {
}
