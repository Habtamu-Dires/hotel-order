package com.hotel.location;

import org.springframework.stereotype.Service;

@Service
public class OrderLocationMapper {

    public LocationResponse toOrderLocationResponse(OrderLocation orderLocation) {
        return LocationResponse.builder()
                .id(orderLocation.getId().toString())
                .number(orderLocation.getNumber())
                .type(orderLocation.getType())
                .address(orderLocation.getAddress())
                .status(orderLocation.getStatus())
                .description(orderLocation.getDescription())
                .lastModifiedBy(orderLocation.getLastModifiedBy())
                .lastModifiedDate(orderLocation.getLastModifiedDate())
                .build();
    }


}
