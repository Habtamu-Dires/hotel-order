package com.hotel.item;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ItemRequest(
         String id,
         @NotBlank(message = "Name is Mandatory")
         String name,
         @NotBlank(message = "Category is Mandatory")
         String categoryId,
         @NotBlank(message = "Description is Mandatory")
         String description,
         @Positive(message = "Price should be Positive")
         @NotNull(message = "Price is Mandatory")
         BigDecimal price,
         @Positive(message = "Quantity should be Positive")
         Integer stockQuantity,
         @NotNull(message = "Availability Info is Mandatory")
         boolean isAvailable,
         String imageUrl
) {}
