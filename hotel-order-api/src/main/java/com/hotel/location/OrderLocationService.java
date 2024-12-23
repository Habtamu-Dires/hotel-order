package com.hotel.location;

import com.hotel.common.IdResponse;
import com.hotel.common.PageResponse;
import com.hotel.exception.OperationNotPermittedException;
import com.hotel.item.ItemResponse;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    public IdResponse saveLocation(@Valid LocationRequest request) {
         LocationType locationType = LocationType.valueOf(request.type());
         LocationStatus locationStatus = LocationStatus.valueOf(request.status());

         OrderLocation orderLocation = OrderLocation.builder()
                            .number(request.number())
                            .type(locationType)
                            .address(request.address())
                            .status(locationStatus)
                            .description(request.description())
                            .build();

        if(request.id() != null && !request.id().isBlank()){
            orderLocation.setId(UUID.fromString(request.id()));
        } else { // new save
            var oldLocation = this.findLocationByNumberAndType(request.number(), locationType);
            if(oldLocation != null){
                throw new EntityExistsException("Location already exists");
            }
            orderLocation.setId(UUID.randomUUID());  // new
        }
        String id = repository.save(orderLocation).getId().toString();
        return new IdResponse(id);
    }

    // find location by id and type
    public OrderLocation findLocationByNumberAndType(Integer number, LocationType type){

        return repository.findLocationByNumberAndLocationType(number,type)
                .orElse(null);
    }

    // get all locations
    public List<LocationResponse> getAllOrderLocations() {
        return repository.findAll().stream()
                .map(mapper::toOrderLocationResponse)
                .toList();
    }

    // get page of locations
    public PageResponse<LocationResponse> getPageOfLocations(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderLocation> res = repository.findAll(pageable);
        List<LocationResponse> locationResponseList = res
                .map(mapper::toOrderLocationResponse)
                .toList();

        return PageResponse.<LocationResponse>builder()
                .content(locationResponseList)
                .totalElements(res.getTotalElements())
                .numberOfElements(res.getNumberOfElements())
                .totalPages(res.getTotalPages())
                .size(res.getSize())
                .number(res.getNumber())
                .first(res.isFirst())
                .last(res.isLast())
                .empty(res.isEmpty())
                .build();

    }


    //find by id
    public OrderLocation findOrderLocationById(String id){
        return repository.findById(UUID.fromString(id))
                .orElseThrow(()-> new EntityNotFoundException(
                        "Location with id: " +id+ " not found")
                );
    }



    //get pages of location by type
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public PageResponse<LocationResponse> getPageOfLocationByType(String type, int page, int size) {
        LocationType locationType =null;
        try{
            locationType = LocationType.valueOf(type);
        } catch (IllegalArgumentException ignored){}
        var typeSpec = LocationSpecification.typeIs(locationType);
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderLocation> res = repository.findAll(typeSpec, pageable);
        List<LocationResponse> locationResponseList = res
                .map(mapper::toOrderLocationResponse)
                .toList();

        return PageResponse.<LocationResponse>builder()
                .content(locationResponseList)
                .totalElements(res.getTotalElements())
                .numberOfElements(res.getNumberOfElements())
                .totalPages(res.getTotalPages())
                .size(res.getSize())
                .number(res.getNumber())
                .first(res.isFirst())
                .last(res.isLast())
                .empty(res.isEmpty())
                .build();

    }


    // get available rooms
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public List<LocationResponse> getAvailableRooms() {
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

    // get location by id
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public LocationResponse getLocationById(String locationId) {
        return mapper.toOrderLocationResponse(this.findOrderLocationById(locationId));
    }

    //search
    public List<LocationResponse> searchLocationByNumber(int number, String type) {
        LocationType locationType = null ;
        try{
           locationType = LocationType.valueOf(type);
        } catch (IllegalArgumentException ignored){}
        Specification<OrderLocation> combinedSpec = LocationSpecification
                .numberStartsWith(number)
                .and(LocationSpecification.typeIs(locationType));

        return repository.findAll(combinedSpec)
                .stream()
                .map(mapper::toOrderLocationResponse)
                .toList();
    }

    // delete location
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteLocation(String locationId) {
        OrderLocation location = this.findOrderLocationById(locationId);
        repository.delete(location);
    }
}
