package com.hotel.category;

import lombok.Builder;

import java.util.List;

@Builder
public record CategoryResponse(
        String id,
        String name,
        String imageUrl,
        String parentCategoryId,
        List<CategoryResponse> subCategories
) {}
