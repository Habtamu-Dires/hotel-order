package com.hotel.order_location;

import com.hotel.api_response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locations")
@RequiredArgsConstructor
public class OrderLocationController {

    private final OrderLocationService service;

    @GetMapping
    public ApiResponse<List<OrderLocationDTO>> getAllOrderLocations(){
        var res = service.getAllOrderLocations();
        return ApiResponse.<List<OrderLocationDTO>>builder()
            .success(true)
            .data(res)
            .message("List of Order Locations")
            .build();
    }

    @PostMapping
    public ApiResponse<?> createOrderLocation(
            @RequestBody OrderLocationDTO orderLocationDTO
    ) {
        service.createOrderLocation(orderLocationDTO);
        return ApiResponse.builder()
            .success(true)
            .data(null)
            .message(String.format("Order Location %s created", orderLocationDTO.number()))
            .build();
    }

    //check-out
    @PutMapping("/check-out")
    public ApiResponse<?> checkout(
            @RequestBody OrderLocationDTO orderLocationDTO
    ) {
        service.checkout(orderLocationDTO);
        return ApiResponse.builder()
            .success(true)
            .data(null)
            .message(String.format("Order Location %s cleared", orderLocationDTO.number()))
            .build();
    }

}
