package com.hotel.batch.monthly_order_data;

import com.hotel.order.ItemOrder;
import org.springframework.batch.item.ItemProcessor;

import java.time.LocalDateTime;

public class MonthlyOrderDataProcessor implements ItemProcessor<ItemOrder,MonthlyOrderData> {

    private final Integer currentYear = LocalDateTime.now().getYear();

    @Override
    public MonthlyOrderData process(ItemOrder order) throws Exception {
        return MonthlyOrderData.builder()
                .year(currentYear)
                .month(order.getCreatedDate().getMonth().toString())
                .totalOrder(1)
                .totalTransaction(order.getTotalPrice())
                .build();
    }


}
