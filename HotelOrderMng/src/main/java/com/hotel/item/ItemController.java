package com.hotel.item;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/items")
@Tag(name = "items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService service;
    //save items
    @PostMapping()
    public ResponseEntity<String> saveItem(
            @RequestBody @Valid ItemRequest request){

        return ResponseEntity.ok( service.saveItem(request));
    }

    //update item availability status
    @PutMapping("/toggle-availability/{item-id}")
    public ResponseEntity<String> updateItemStatus(
            @PathVariable("item-id") String itemId
    ){
        return ResponseEntity.ok(service.toggleAvailability(itemId));
    }

    // get all items
    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAllItems(){
       return ResponseEntity.ok(service.getAllItems());
    }

    // get available items
    @GetMapping("/available")
    public ResponseEntity<List<ItemResponse>> getAvailableItems() {
        return ResponseEntity.ok(service.getAvailableItems());
    }

    // get items by category id
    @GetMapping("/{category-id}")
    public ResponseEntity<List<ItemResponse>> getItemsByCategory(
            @PathVariable("category-id") String categoryId
    ){
        return ResponseEntity.ok(service.getItemByCategory(categoryId));
    }

    //upload item cover image
    @PostMapping(value = "/cover-picture/{item-id}", consumes = "Multipart/form")
    public ResponseEntity<?> uploadCoverPicture(
            @PathVariable("item-id") String itemId,
            @RequestPart MultipartFile file
            )
    {
        service.uploadCoverPicture(itemId, file);
        return null;
    }

    //delete item
    @DeleteMapping("/{item-id}")
    public ResponseEntity<?> deleteItem(
            @PathVariable("item-id") String itemId
    ){
        service.deleteItem(itemId);
        return ResponseEntity.accepted().build();
    }

}
