package com.hotel.batch.daily_average_order;

import com.hotel.order.ItemOrder;
import org.springframework.batch.item.ItemProcessor;

public class DailyAverageOrderProcessor implements ItemProcessor<ItemOrder,DailyAverageOrder> {

    @Override
    public DailyAverageOrder process(ItemOrder order) throws Exception {
        return DailyAverageOrder.builder()
                .id(1)
                .totalOrder(1)
                .totalTransaction(order.getTotalPrice())
                .build();
    }
}
