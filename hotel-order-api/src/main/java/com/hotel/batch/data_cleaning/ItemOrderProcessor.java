package com.hotel.batch.data_cleaning;

import com.hotel.order.ItemOrder;
import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.batch.item.ItemProcessor;

public class ItemOrderProcessor implements ItemProcessor<ItemOrder, ItemOrder> {

    @Override
    public ItemOrder process(@NonNull ItemOrder item) throws Exception {
        return item;
    }
}
