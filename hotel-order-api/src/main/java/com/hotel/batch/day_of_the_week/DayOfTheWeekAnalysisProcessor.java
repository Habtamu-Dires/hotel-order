package com.hotel.batch.day_of_the_week;

import com.hotel.order.ItemOrder;
import org.springframework.batch.item.ItemProcessor;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

public class DayOfTheWeekAnalysisProcessor implements ItemProcessor<ItemOrder,DayOfTheWeekAnalysis> {

    private final DayOfWeek yesterday = LocalDateTime.now().getDayOfWeek();

    @Override
    public DayOfTheWeekAnalysis process(ItemOrder order) throws Exception {
        System.out.println("So day of the week analysis process");
        return DayOfTheWeekAnalysis.builder()
                .dayOfTheWeek(order.getLastModifiedDate().getDayOfWeek().toString())
                .totalOrder(1)
                .totalTransaction(order.getTotalPrice())
                .build();
    }
}

