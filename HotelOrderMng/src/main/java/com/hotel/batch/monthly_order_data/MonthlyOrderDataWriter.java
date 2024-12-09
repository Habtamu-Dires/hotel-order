package com.hotel.batch.monthly_order_data;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;

@RequiredArgsConstructor
public class MonthlyOrderDataWriter implements ItemWriter<MonthlyOrderData> {

    private final MonthlyOrderDataRepository repository;

    @Override
    public void write(Chunk<? extends MonthlyOrderData> chunk) throws Exception {
        for(MonthlyOrderData data:chunk){
            repository.upsertMonthlyData(
                    data.getYear(),
                    data.getMonth(),
                    data.getTotalOrder(),
                    data.getTotalTransaction()
            );
        }
    }
}
