package com.hotel.category;

import lombok.Builder;

import java.util.List;

@Builder
public record CategoryResponse(
        String id,
        String name,
        String description,
        String imageUrl,
        Integer popularityIndex,
        CategoryResponse parentCategory,
        List<CategoryResponse> subCategories
) {}
