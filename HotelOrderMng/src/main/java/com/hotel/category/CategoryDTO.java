package com.hotel.category;

import com.hotel.item.ItemDTO;
import lombok.Builder;

import java.util.List;

@Builder
public record CategoryDTO(
        String id,
        String name,
        String imageUrl,
        List<ItemDTO> itemList,
        List<CategoryDTO> subCategories,
        String parentCategoryId
) {
}
