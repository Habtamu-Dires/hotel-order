package com.hotel.location;

import lombok.Builder;

@Builder
public record OrderLocationResponse(
        String id,
        Integer number,
        LocationType type,
        String address,
        LocationStatus status,
        String description
) {
}
