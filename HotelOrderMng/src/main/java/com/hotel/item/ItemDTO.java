package com.hotel.item;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ItemDTO(
        String id,
        String name,
        String imageUrl,
        String description,
        String categoryId,
        BigDecimal price,
        Integer stockQuantity,
        boolean isAvailable
) {}
