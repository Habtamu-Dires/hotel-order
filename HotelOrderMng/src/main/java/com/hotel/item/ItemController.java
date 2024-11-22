package com.hotel.item;

import com.hotel.common.IdResponse;
import com.hotel.common.PageResponse;
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
    @PostMapping
    public ResponseEntity<IdResponse> saveItem(
            @RequestBody @Valid ItemRequest request){

        return ResponseEntity.ok(service.saveItem(request));
    }

    // get all items
    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAllItems(){
        return ResponseEntity.ok(service.getAllItems());
    }

    // get page of items
    @GetMapping("/page")
    public ResponseEntity<PageResponse<ItemResponse>> getPageOfItems(
            @RequestParam(value = "page",defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size
    ){
        return ResponseEntity.ok(service.getPageOfItems(page,size));
    }

    //update item availability status
    @PutMapping("/toggle-availability/{item-id}")
    public ResponseEntity<String> updateItemStatus(
            @PathVariable("item-id") String itemId
    ){
        return ResponseEntity.ok(service.toggleAvailability(itemId));
    }


    // get item by Id
    @GetMapping("/{item-id}")
    public ResponseEntity<ItemResponse> getItemById(
            @PathVariable("item-id") String itemId
    ){
        return ResponseEntity.ok(service.getItemById(itemId));
    }

    // get available items
    @GetMapping("/available")
    public ResponseEntity<List<ItemResponse>> getAvailableItems() {
        return ResponseEntity.ok(service.getAvailableItems());
    }

    // get items by category id
    @GetMapping("/category/{category-id}")
    public ResponseEntity<List<ItemResponse>> getItemsByCategory(
            @PathVariable("category-id") String categoryId
    ){
        return ResponseEntity.ok(service.getItemByCategory(categoryId));
    }

    // get page of items by category id
    @GetMapping("/category/page/{category-id}")
    public ResponseEntity<PageResponse<ItemResponse>> getPageOfItemsByCategory(
            @PathVariable("category-id") String categoryId,
            @RequestParam(value = "page",defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size
    ){
        return ResponseEntity.ok(service.getPageOfItemsByCategory(categoryId, page, size));
    }

    //upload item cover image
    @PostMapping(value = "/cover-picture/{item-id}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadCoverPicture(
            @PathVariable("item-id") String itemId,
            @RequestPart MultipartFile file
            )
    {
        service.uploadCoverPicture(itemId, file);
        return ResponseEntity.accepted().build();
    }

    //delete item
    @DeleteMapping("/{item-id}")
    public ResponseEntity<?> deleteItem(
            @PathVariable("item-id") String itemId
    ){
        service.deleteItem(itemId);
        return ResponseEntity.accepted().build();
    }

    // search
    @GetMapping("/search/name/{item-name}")
    public ResponseEntity<List<ItemResponse>> searchItemsByName(
            @PathVariable("item-name") String itemName,
            @RequestParam(value = "category-id") String categoryId
    ) {
        return ResponseEntity.ok(service.searchItemByName(itemName,categoryId));
    }

}
