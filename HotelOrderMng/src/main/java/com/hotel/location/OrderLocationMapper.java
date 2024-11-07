package com.hotel.location;

import org.springframework.stereotype.Service;

@Service
public class OrderLocationMapper {

    public OrderLocationResponse toOrderLocationResponse(OrderLocation orderLocation) {
        return OrderLocationResponse.builder()
                .id(orderLocation.getId().toString())
                .number(orderLocation.getNumber())
                .type(orderLocation.getType())
                .address(orderLocation.getAddress())
                .status(orderLocation.getStatus())
                .description(orderLocation.getDescription())
                .build();
    }


}
