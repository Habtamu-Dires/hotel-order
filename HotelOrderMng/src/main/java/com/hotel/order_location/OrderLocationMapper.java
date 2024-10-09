package com.hotel.order_location;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class OrderLocationMapper {

    public OrderLocationDTO toOrderLocationDTO(OrderLocation orderLocation) {
        return OrderLocationDTO.builder()
                .id(orderLocation.getId().toString())
                .number(orderLocation.getNumber())
                .type(orderLocation.getType())
                .address(orderLocation.getAddress())
                .status(orderLocation.getStatus())
                .build();
    }

    public OrderLocation toOrderLocation(OrderLocationDTO orderLocationDTO) {
      return   OrderLocation.builder()
                .number(orderLocationDTO.number())
                .type(orderLocationDTO.type())
                .address(orderLocationDTO.address())
                .status(orderLocationDTO.status())
                .build();
    }

}
