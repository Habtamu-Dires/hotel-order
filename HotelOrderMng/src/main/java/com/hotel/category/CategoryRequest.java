package com.hotel.category;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record CategoryRequest(
        String id,
        @NotBlank(message = "Name is Mandatory")
        String name,
        String description,
        String parentCategoryId,
        String imageUrl
) {}
