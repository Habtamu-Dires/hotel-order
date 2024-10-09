package com.hotel.order;

import com.hotel.api_response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class ItemOrderController {

    private final ItemOrderService service;

    @GetMapping
    public ApiResponse<List<ItemOrderDTO>> getAllItemOrders(){
       var res =  service.getAllItemOrders();
        return ApiResponse.<List<ItemOrderDTO>>builder()
                .success(true)
                .data(res)
                .message("List of All Item Orders")
                .build();
    }

    //get pending orders
    @GetMapping("/pending")
    public ApiResponse<List<ItemOrderDTO>> getPendingOrders(){
        var res =  service.getPendingOrders();
        return ApiResponse.<List<ItemOrderDTO>>builder()
                .success(true)
                .data(res)
                .message("List of All Item Orders")
                .build();
    }
    //create
    @PostMapping
    public ApiResponse<?> createOrder(
            @RequestBody ItemOrderDTO itemOrderDTO
    ){
        service.createOrder(itemOrderDTO);
        return ApiResponse.builder()
                .success(true)
                .data(null)
                .message("Order successfully placed")
                .build();
    }

    // update order
    @PutMapping
    public ApiResponse<ItemOrderDTO> updateOrder(
            @RequestBody ItemOrderDTO itemOrderDTO
    ) {
        var res = service.updateOrder(itemOrderDTO);
        return ApiResponse.<ItemOrderDTO>builder()
                .success(true)
                .data(res)
                .message("Order successfully updated")
                .build();
    }


}
