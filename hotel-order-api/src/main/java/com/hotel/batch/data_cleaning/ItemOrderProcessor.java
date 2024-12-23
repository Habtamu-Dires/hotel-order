package com.hotel.batch.data_cleaning;

import com.hotel.order.ItemOrder;
import org.springframework.batch.item.ItemProcessor;

public class ItemOrderProcessor implements ItemProcessor<ItemOrder, ItemOrder> {

    @Override
    public ItemOrder process(ItemOrder item) throws Exception {
        return null;
    }
}
