package com.hotel.item;

import com.hotel.category.CategoryResponse;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record ItemResponse(
        String id,
        String name,
        String imageUrl,
        String description,
        CategoryResponse category,
        BigDecimal price,
        Integer stockQuantity,
        String lastModifiedBy,
        LocalDateTime lastModifiedDate,
        boolean isAvailable
) {}
