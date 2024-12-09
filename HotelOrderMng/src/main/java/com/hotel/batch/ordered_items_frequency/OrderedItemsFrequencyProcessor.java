package com.hotel.batch.ordered_items_frequency;

import com.hotel.order_detail.OrderDetail;
import org.springframework.batch.item.ItemProcessor;

public class OrderedItemsFrequencyProcessor implements ItemProcessor<OrderDetail, OrderedItemsFrequency> {
    @Override
    public OrderedItemsFrequency process(OrderDetail orderDetail) throws Exception {
        return OrderedItemsFrequency.builder()
                .frequency(orderDetail.getQuantity())
                .item(orderDetail.getItem())
                .build();
    }
}
