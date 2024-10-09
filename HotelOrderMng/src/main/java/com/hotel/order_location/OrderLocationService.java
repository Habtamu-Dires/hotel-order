package com.hotel.order_location;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderLocationService {

    private final OrderLocationRepository repository;
    private final OrderLocationMapper mapper;

    public List<OrderLocationDTO> getAllOrderLocations() {
        return repository.findAll().stream()
                .map(mapper::toOrderLocationDTO)
                .toList();
    }

    public void createOrderLocation(OrderLocationDTO orderLocationDTO) {
        OrderLocation orderLocation = mapper.toOrderLocation(orderLocationDTO);
        orderLocation.setId(UUID.randomUUID());
        repository.save(orderLocation);
    }
    //check-out
    public void checkout(OrderLocationDTO orderLocationDTO) {
        OrderLocation orderLocation = mapper.toOrderLocation(orderLocationDTO);
        orderLocation.setOrderList(List.of());
        repository.save(orderLocation);
    }

    //find by id
    public Optional<OrderLocation> findOrderLocationById(UUID id){
        return repository.findById(id);
    }
}
