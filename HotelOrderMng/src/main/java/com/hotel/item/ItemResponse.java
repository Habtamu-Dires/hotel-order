package com.hotel.item;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ItemResponse(
        String id,
        String name,
        String imageUrl,
        String description,
        String categoryId,
        BigDecimal price,
        Integer stockQuantity,
        boolean isAvailable
) {}
