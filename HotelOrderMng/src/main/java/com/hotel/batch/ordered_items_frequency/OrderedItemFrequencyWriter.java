package com.hotel.batch.ordered_items_frequency;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;

@RequiredArgsConstructor
public class OrderedItemFrequencyWriter implements ItemWriter<OrderedItemsFrequency> {

    private final OrderedItemsFrequencyRepository repository;

    @Override
    public void write(Chunk<? extends OrderedItemsFrequency> chunk) throws Exception {
        for(OrderedItemsFrequency data : chunk){
            repository.upsertItemFrequency(
                    data.getFrequency(),
                    data.getItem().getId()
            );
        }
    }
}
