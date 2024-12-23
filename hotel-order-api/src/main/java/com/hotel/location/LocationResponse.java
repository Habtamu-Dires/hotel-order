package com.hotel.location;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record LocationResponse(
        String id,
        Integer number,
        LocationType type,
        String address,
        LocationStatus status,
        String description,
        String lastModifiedBy,
        LocalDateTime lastModifiedDate
) {
}
