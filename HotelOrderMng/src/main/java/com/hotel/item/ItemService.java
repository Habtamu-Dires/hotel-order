package com.hotel.item;

import com.hotel.category.CategoryService;
import com.hotel.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemMapper mapper;
    private final CategoryService categoryService;

    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll().stream()
                .map(mapper::toItemDTO)
                .toList();
    }

    // create new item
    @Transactional
    public void createItem(List<ItemDTO> itemDTOs) {
        itemDTOs.forEach(itemDTO -> {
            var category =  categoryService.findCategoryById(UUID.fromString(itemDTO.categoryId()))
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Could not create an item, category  not found"
                    ));
            Item item = mapper.toItem(itemDTO);
            item.setCategory(category);
            item.setId(UUID.randomUUID());
            itemRepository.save(item);
        });

    }

    //find item by id
    public Optional<Item> findItemById(UUID id){
        return itemRepository.findById(id);
    }

    //check if item is available
    public boolean isItemAvailable(Item item, Integer quantity){
        if(item.getStockQuantity() == null && item.isAvailable()){
            return true;
        } else if(item.getStockQuantity() !=null && item.getStockQuantity() < quantity) {
            item.setAvailable(false);
            itemRepository.save(item);
            return false;
        }

        return item.isAvailable();
    }

    public List<ItemDTO> getAvailableItems() {
        return itemRepository.findAll().stream()
                .filter(Item::isAvailable)
                .filter(item -> {
                    if(item.getStockQuantity() != null){
                        return item.getStockQuantity() > 0;
                    }
                    return true;
                })
                .map(mapper::toItemDTO)
                .toList();
    }
}
