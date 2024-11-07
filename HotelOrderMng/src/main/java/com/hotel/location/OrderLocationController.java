package com.hotel.location;

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

    @PostMapping
    public ResponseEntity<String> saveOrderLocation(
            @RequestBody @Valid OrderLocationRequest request
    ) {
       return ResponseEntity.ok(service.saveLocation(request));
    }

    @GetMapping
    public ResponseEntity<List<OrderLocationResponse>> getAllOrderLocations(){
        return ResponseEntity.ok(service.getAllOrderLocations());
    }

    @GetMapping("/rooms/available")
    public ResponseEntity<List<OrderLocationResponse>> getAvailableRooms(){
        return ResponseEntity.ok(service.getAvailableRooms());
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<OrderLocationResponse>> getAllRooms(){
        return ResponseEntity.ok(service.getAllRooms());
    }

    @GetMapping("/tables")
    public ResponseEntity<List<OrderLocationResponse>> getAllTables(){
        return ResponseEntity.ok(service.getAllTables());
    }

    //update room status
    @PutMapping("/rooms/update-status/{room-id}")
    public ResponseEntity<String> updateRoomStatus(
            @PathVariable("room-id") String roomId,
            @RequestParam("status") LocationStatus status
    ){
        return ResponseEntity.ok(service.updateRoomStatus(roomId, status));
    }

}
