package com.hotel.order_location;

import lombok.Builder;

@Builder
public record OrderLocationDTO(
        String id,
        Integer number,
        LocationType type,
        String address,
        LocationStatus status
) {
}
