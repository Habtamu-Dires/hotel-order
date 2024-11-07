package com.hotel.batch.ordered_items_frequency;

import lombok.Builder;

@Builder
public record OrderedItemsFrequencyResponse(
        Integer frequency,
        String itemName
) {}
