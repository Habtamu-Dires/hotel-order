package com.hotel.batch.ordered_items_frequency;

import com.hotel.order.ItemOrder;
import com.hotel.order_detail.OrderDetail;
import org.springframework.batch.item.ItemProcessor;

import java.util.List;

public class OrderedItemsFrequencyProcessor implements ItemProcessor<OrderDetail, OrderedItemsFrequency> {
    @Override
    public OrderedItemsFrequency process(OrderDetail orderDetail) throws Exception {

        return OrderedItemsFrequency.builder()
                .frequency(1)
                .item(orderDetail.getItem())
                .build();
    }
}
