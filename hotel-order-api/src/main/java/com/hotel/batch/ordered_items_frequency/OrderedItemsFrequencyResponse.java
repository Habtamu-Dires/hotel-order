package com.hotel.batch.ordered_items_frequency;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record OrderedItemsFrequencyResponse(
        String imageUrl,
        String itemName,
        BigDecimal price,
        Integer frequency

) {}
