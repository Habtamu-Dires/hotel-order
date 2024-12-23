package com.hotel.batch.daily_average_order;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;


@RequiredArgsConstructor
public class DailyAverageOrderWriter implements ItemWriter<DailyAverageOrder> {

    private final DailyAverageOrderRepository repository;

    @Override
    public void write(Chunk<? extends DailyAverageOrder> chunks) throws Exception {
        for (DailyAverageOrder item : chunks) {
            repository.updateDailyAverageOrder(
                    item.getId(),
                    item.getTotalOrder(),
                    item.getTotalTransaction()
            );
        }
    }
}
