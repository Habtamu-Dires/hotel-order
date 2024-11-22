package com.hotel.location;

import com.hotel.common.IdResponse;
import com.hotel.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locations")
@Tag(name = "locations")
@RequiredArgsConstructor
public class OrderLocationController {

    private final OrderLocationService service;

    // save order
    @PostMapping
    public ResponseEntity<IdResponse> saveOrderLocation(
            @RequestBody @Valid LocationRequest request
    ) {
       return ResponseEntity.ok(service.saveLocation(request));
    }

    // get all locations
    @GetMapping
    public ResponseEntity<List<LocationResponse>> getAllOrderLocations(){
        return ResponseEntity.ok(service.getAllOrderLocations());
    }

    // get page of locations
    @GetMapping("/page")
    public ResponseEntity<PageResponse<LocationResponse>> getPageOfLocations(
            @RequestParam(value = "page",defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size
    ){
        return ResponseEntity.ok(service.getPageOfLocations(page,size));
    }

    // get location by id
    @GetMapping("/{location-id}")
    public ResponseEntity<LocationResponse> getLocationById(
        @PathVariable("location-id") String locationId
    ){
        return ResponseEntity.ok(service.getLocationById(locationId));
    }

    // get available rooms
    @GetMapping("/rooms/available")
    public ResponseEntity<List<LocationResponse>> getAvailableRooms(){
        return ResponseEntity.ok(service.getAvailableRooms());
    }

    // get page of locations by type
    @GetMapping("/page/{location-type}")
    public ResponseEntity<PageResponse<LocationResponse>> getPageOfLocationByType(
            @PathVariable("location-type") String type,
            @RequestParam(value = "page",defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size
    ){
        return ResponseEntity.ok(service.getPageOfLocationByType(type,page,size));
    }


    //update room status
    @PutMapping("/rooms/update-status/{room-id}")
    public ResponseEntity<String> updateRoomStatus(
            @PathVariable("room-id") String roomId,
            @RequestParam("status") LocationStatus status
    ){
        return ResponseEntity.ok(service.updateRoomStatus(roomId, status));
    }

    // delete location
    @DeleteMapping("/{location-id}")
    public ResponseEntity<?> deleteLocationById(
            @PathVariable("location-id") String locationId
    ){
        service.deleteLocation(locationId);
        return ResponseEntity.accepted().build();
    }

    //search location by number
    @GetMapping("/search/number/{location-number}")
    public ResponseEntity<List<LocationResponse>> searchLocationByNumber(
            @PathVariable("location-number") int number,
            @RequestParam("location-type") String type
    ){
        return ResponseEntity.ok(service.searchLocationByNumber(number, type));
    }

}
