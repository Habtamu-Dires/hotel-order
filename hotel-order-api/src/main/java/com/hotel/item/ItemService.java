package com.hotel.item;

import com.hotel.category.Category;
import com.hotel.category.CategoryRepository;
import com.hotel.category.CategoryService;
import com.hotel.common.IdResponse;
import com.hotel.common.PageResponse;
import com.hotel.file.FileStorageService;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository repository;
    private final ItemMapper mapper;
    private final CategoryService categoryService;
    private final FileStorageService fileStorageService;
    private final CategoryRepository categoryRepository;

    //save item
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public IdResponse saveItem(@Valid ItemRequest request) {
       Category category = categoryService.findCategoryById(request.categoryId());

       Item item = Item.builder()
                .name(request.name())
                .price(request.price())
                .categories(List.of(category))
                .description(request.description())
                .isAvailable(request.isAvailable())
                .stockQuantity(request.stockQuantity())
                .imageUrl(request.imageUrl())
                .popularityIndex(request.popularityIndex() == null ?
                        0 : request.popularityIndex())
                .build();

       if(request.id() != null && !request.id().isBlank()){
           item.setId(UUID.fromString(request.id()));
       } else {
           item.setId(UUID.randomUUID());
       }

       // add items to category
       category.getItems().add(item);

       // save items
       String id = repository.save(item).getId().toString();
       categoryRepository.save(category); // save category

       return new IdResponse(id);
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

    // get page of items
    public PageResponse<ItemResponse> getPageOfItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Item> res = repository.findAll(pageable);
        List<ItemResponse> itemResponseList = res
                .map(mapper::toItemResponse)
                .toList();

        return PageResponse.<ItemResponse>builder()
                .content(itemResponseList)
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

    // get page of items by category
    public PageResponse<ItemResponse> getPageOfItemsByCategory(String categoryId, int page, int size) {
        Category category = categoryService.findCategoryById(categoryId);
        Pageable pageable = PageRequest.of(page, size);
        Page<Item> res = repository.findPageOfItemByCategoryId(category.getId(),pageable);
        List<ItemResponse> itemResponseList = res
                .map(mapper::toItemResponse)
                .toList();

        return PageResponse.<ItemResponse>builder()
                .content(itemResponseList)
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

    // get item by id
    public ItemResponse getItemById(String itemId) {
        return mapper.toItemResponse(this.findItemById(itemId));
    }

    //check if item is available
    public boolean isItemAvailable(Item item, int quantity){
         if(item.getStockQuantity() !=null) {
             int stockQuantity = item.getStockQuantity();
             int newQuantity = stockQuantity - quantity;
             if(newQuantity > 0) {
                 item.setStockQuantity(newQuantity);
                 repository.save(item);
                 return true;
             } else if(newQuantity == 0) {
                 item.setAvailable(false);
                 item.setStockQuantity(newQuantity);
                 repository.save(item);
                 return  true;
             } else {
                 return false;
             }
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

    // get available items by category
    public List<ItemResponse> getAvailableItemByCategory(String categoryId) {
        Category category = categoryService.findCategoryById(categoryId);
        return repository.findAvailableItemByCategoryId(category.getId())
                .stream()
                .sorted(Comparator.comparingInt(Item::getPopularityIndex).reversed())
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
    @Transactional
    public void deleteItem(String itemId) {
        Item item = this.findItemById(itemId);
        List<Category> categorieList = new ArrayList<>(item.getCategories());
        for(Category category : categorieList){
            category.removeItem(item);
            categoryRepository.save(category);
        }
        fileStorageService.deleteImage(item.getImageUrl());
        repository.delete(item);
    }

    // search
    public List<ItemResponse> searchItemByName(String itemName, String categoryId) {
        Specification<Item> searchSpec = ItemSpecification
                .searchItem(itemName,categoryId);

        return repository.findAll(searchSpec)
                .stream()
                .map(mapper::toItemResponse)
                .toList();
    }

}
