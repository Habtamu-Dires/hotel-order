package com.hotel.category;

import com.hotel.item.ItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryMapper {

    private final ItemMapper itemMapper;

    // category DTO
    public CategoryDTO toCategoryDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId().toString())
                .name(category.getName())
                .imageUrl(category.getImageUrl())
                .parentCategoryId(
                        category.getParentCategory() != null
                            ?  category.getParentCategory().getId().toString()
                            : null
                )
                .subCategories(
                        category.getSubCategories().stream()
                        .map(this::toCategoryDTO)
                        .toList()
                )
                .build();
    }
}
