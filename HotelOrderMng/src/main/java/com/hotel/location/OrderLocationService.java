package com.hotel.location;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderLocationService {

    private final OrderLocationRepository repository;
    private final OrderLocationMapper mapper;

    // save location
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String saveLocation(@Valid OrderLocationRequest request) {
         OrderLocation orderLocation = OrderLocation.builder()
                            .number(request.number())
                            .type(request.type())
                            .address(request.address())
                            .status(request.status())
                            .description(request.description())
                            .build();

        if(request.id() != null && !request.id().isBlank()){
            orderLocation.setId(UUID.fromString(request.id()));
        } else {
            orderLocation.setId(UUID.randomUUID());  // new
        }
        return repository.save(orderLocation).getId().toString();
    }

    public List<OrderLocationResponse> getAllOrderLocations() {
        return repository.findAll().stream()
                .map(mapper::toOrderLocationResponse)
                .toList();
    }

    //find by id
    public OrderLocation findOrderLocationById(String id){
        return repository.findById(UUID.fromString(id))
                .orElseThrow(()-> new EntityNotFoundException(
                        "Location with id: " +id+ " not found")
                );
    }

    //get all rooms
    public List<OrderLocationResponse> getAllRooms() {
        return repository.findAllRooms().stream()
                .map(mapper::toOrderLocationResponse)
                .toList();
    }

    //get all tables
    public List<OrderLocationResponse> getAllTables() {
        return repository.findAllTables().stream()
                .map(mapper::toOrderLocationResponse)
                .toList();
    }


    // get available rooms
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public List<OrderLocationResponse> getAvailableRooms() {
        return repository.findReadyRooms().stream()
                .map(mapper::toOrderLocationResponse)
                .toList();
    }


    // update room status
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public String updateRoomStatus(String roomId, LocationStatus status) {
        OrderLocation location = this.findOrderLocationById(roomId);
        location.setStatus(status);

        return repository.save(location).getId().toString();
    }
}
