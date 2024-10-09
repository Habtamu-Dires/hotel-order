package com.hotel.item;

import com.hotel.api_response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    public ApiResponse<List<ItemDTO>> getAllItems(){
        var res = itemService.getAllItems();
        return ApiResponse.<List<ItemDTO>>builder()
                .success(true)
                .data(res)
                .message("List of all items")
                .build();
    }

    @GetMapping("/available")
    public ApiResponse<List<ItemDTO>> getAvailableItems(){
        var res = itemService.getAvailableItems();
        return ApiResponse.<List<ItemDTO>>builder()
                .success(true)
                .data(res)
                .message("List of all items")
                .build();
    }

    @PostMapping()
    public ApiResponse<?> createItem(@RequestBody List<ItemDTO> itemDTOs){
        itemService.createItem(itemDTOs);
        return ApiResponse.builder()
                .success(true)
                .data(null)
                .message("Items created")
                .build();
    }

}
