package com.hotel.item;

import org.springframework.stereotype.Service;

@Service
public class ItemMapper {

    public ItemResponse toItemResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId().toString())
                .name(item.getName())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .categoryId(item.getCategory().getId().toString())
                .description(item.getDescription())
                .isAvailable(item.isAvailable())
                .build();
    }
}
