package com.hotel.item;

import com.hotel.category.Category;
import com.hotel.category.CategoryMapper;
import com.hotel.category.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemMapper {

    private final CategoryMapper categoryMapper;

    public ItemResponse toItemResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId().toString())
                .name(item.getName())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .category(toCategoryResponse(item.getCategories()))
                .description(item.getDescription())
                .isAvailable(item.isAvailable())
                .stockQuantity(item.getStockQuantity())
                .popularityIndex(item.getPopularityIndex())
                .lastModifiedBy(item.getLastModifiedBy())
                .lastModifiedDate(item.getLastModifiedDate())
                .build();
    }

    private CategoryResponse toCategoryResponse(List<Category> categories){
        if(!categories.isEmpty()){
            if(categories.size() > 1){
                List<Category> categoryList = categories
                        .stream()
                        .peek(cat -> System.out.println(cat.getName()))
                        .filter(cat -> !(cat.getName().equalsIgnoreCase("Popular")))
                        .toList();
                if(!categoryList.isEmpty()){
                    return categoryMapper.toCategoryResponse(categoryList.getFirst());
                }
            }
            return categoryMapper.toCategoryResponse(categories.getFirst());
        }
        return null;
    }

    public ItemResponse toItemResponsePage(Item item, CategoryResponse categoryResponse) {
        return ItemResponse.builder()
                .id(item.getId().toString())
                .name(item.getName())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .category(categoryResponse)
                .description(item.getDescription())
                .isAvailable(item.isAvailable())
                .stockQuantity(item.getStockQuantity())
                .popularityIndex(item.getPopularityIndex())
                .lastModifiedBy(item.getLastModifiedBy())
                .lastModifiedDate(item.getLastModifiedDate())
                .build();
    }
}
