package com.hotel.item;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ItemMapper {


    public ItemDTO toItemDTO(Item item) {
        return ItemDTO.builder()
                .id(item.getId().toString())
                .name(item.getName())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .categoryId(item.getCategory().getId().toString())
                .description(item.getDescription())
                .isAvailable(item.isAvailable())
                .build();
    }

    public Item toItem(ItemDTO itemDTO) {
        return Item.builder()
                .name(itemDTO.name())
                .imageUrl(itemDTO.imageUrl())
                .price(itemDTO.price())
                .description(itemDTO.description())
                .isAvailable(itemDTO.isAvailable())
                .build();
    }
}
