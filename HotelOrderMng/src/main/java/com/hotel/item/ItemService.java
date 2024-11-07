package com.hotel.item;

import com.hotel.category.Category;
import com.hotel.category.CategoryService;
import com.hotel.file.FileStorageService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository repository;
    private final ItemMapper mapper;
    private final CategoryService categoryService;
    private final FileStorageService fileStorageService;


    //save item
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String saveItem(@Valid ItemRequest request) {
       Category category = categoryService.findCategoryById(request.categoryId());

       Item item = Item.builder()
                .name(request.name())
                .category(category)
                .price(request.price())
                .description(request.description())
                .isAvailable(request.isAvailable())
                .stockQuantity(request.stockQuantity())
                .build();

       if(request.id() == null){
            item.setId(UUID.randomUUID());
       } else {
           item.setId(UUID.fromString(request.id()));
       }

       return repository.save(item).getId().toString();
    }



    // find item by id
    public Item findItemById(String itemId){
        return repository.findById(UUID.fromString(itemId))
                .orElseThrow(() -> new EntityNotFoundException("Item with id: " +itemId+ " not found"));
    }
    //find all items
    public List<ItemResponse> getAllItems() {
        return repository.findAll().stream()
                .map(mapper::toItemResponse).toList();
    }


    //check if item is available
    public boolean isItemAvailable(Item item, Integer quantity){
         if(item.getStockQuantity() !=null && item.getStockQuantity() <= quantity) {
            item.setAvailable(false);
            item.setStockQuantity(item.getStockQuantity() - quantity);
            repository.save(item);
            return false;
        }

        return item.isAvailable();
    }

    // get available items
    public List<ItemResponse> getAvailableItems() {
        return repository.findAvailableItems().stream()
                .filter(item -> {
                    if(item.getStockQuantity() != null){
                        return item.getStockQuantity() > 0;
                    }
                    return true;
                })
                .map(mapper::toItemResponse)
                .toList();
    }

    // item by category
    public List<ItemResponse> getItemByCategory(String categoryId) {
        Category category = categoryService.findCategoryById(categoryId);
        return repository.findItemByCategoryId(category.getId())
                 .stream()
                 .map(mapper::toItemResponse)
                 .toList();
    }

    @Secured({"ROLE_ADMIN","ROLE_CHEF", "ROLE_BARISTA"})
    public String toggleAvailability(String itemId) {
        Item item = this.findItemById(itemId);
        item.setAvailable(!item.isAvailable());

        return repository.save(item).getId().toString();
    }

    // upload cover picture
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void uploadCoverPicture(String itemId,
                                   MultipartFile file)
    {
         Item item = this.findItemById(itemId);
         //if item has old image delete it
         fileStorageService.deleteImage(item.getImageUrl());

         String imageUrl = fileStorageService.saveFile(file, itemId, "item");
         item.setImageUrl(imageUrl);
         repository.save(item);
    }

    // delete item
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteItem(String itemId) {
        Item item = this.findItemById(itemId);
        fileStorageService.deleteImage(item.getImageUrl());
        repository.delete(item);
    }

}
