package com.hotel.category;

import org.springframework.stereotype.Service;

import java.util.Comparator;

@Service
public class CategoryMapper {

    // category DTO
    public CategoryResponse toCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId().toString())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .popularityIndex(category.getPopularityIndex())
                .parentCategory(
                        category.getParentCategory() != null
                            ? this.toCatResponse(category.getParentCategory())
                            : null
                )
                .subCategories(
                        category.getSubCategories()
                        .stream()
                        .filter(subCat -> !subCat.getItems().isEmpty())
                        .sorted(Comparator.comparing(Category::getPopularityIndex))
                        .map(this::toCatResponse)
                        .toList()
                )
                .build();
    }

    private CategoryResponse toCatResponse(Category category){
        return CategoryResponse.builder()
                .id(category.getId().toString())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .build();
    }
}
