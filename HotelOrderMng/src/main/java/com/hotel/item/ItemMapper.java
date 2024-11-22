package com.hotel.item;

import com.hotel.category.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
                .category(
                        categoryMapper
                        .toCategoryResponse(item.getCategory()))
                .description(item.getDescription())
                .isAvailable(item.isAvailable())
                .stockQuantity(item.getStockQuantity())
                .lastModifiedBy(item.getLastModifiedBy())
                .lastModifiedDate(item.getLastModifiedDate())
                .build();
    }
}
