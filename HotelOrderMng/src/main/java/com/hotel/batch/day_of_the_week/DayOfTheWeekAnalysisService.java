package com.hotel.batch.day_of_the_week;

import com.hotel.order.ItemOrder;
import com.hotel.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DayOfTheWeekAnalysisService {

    private final OrderRepository orderRepository;
    private final DayOfTheWeekAnalysisRepository repository;

    public void removeDataBefore28Days(){
        // day of the week to be updated [ yesterday ]
        DayOfWeek dayOfWeek = LocalDate.now().minusDays(1).getDayOfWeek();
        // get data by dayOfTheWeek
        DayOfTheWeekAnalysis dayOfTheWeekAnalysis =  repository
                .getByDayOfTheWeek(dayOfWeek.toString())
                .orElse( null);
        if(dayOfTheWeekAnalysis != null) {
            //get data before 28 day
            var midNight = LocalDateTime.of(LocalDate.now(),LocalTime.MIDNIGHT);
            List<ItemOrder> oldList = orderRepository.getCompletedOrdersBefore(midNight.minusDays(28));

            if(!oldList.isEmpty()) {
                //totalOrders
                Integer totalOrder = oldList.size();
                //total transaction
                BigDecimal totalTransaction = oldList.stream()
                        .map(ItemOrder::getTotalPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                // update / reduce the totals
                int newVal = dayOfTheWeekAnalysis.getTotalOrder() - totalOrder;
                dayOfTheWeekAnalysis.setTotalOrder(newVal);
                BigDecimal newTotalTransaction = dayOfTheWeekAnalysis.getTotalTransaction().subtract(totalTransaction);
                dayOfTheWeekAnalysis.setTotalTransaction(newTotalTransaction);

                // save
                repository.save(dayOfTheWeekAnalysis);

            }
        } else {
            repository.save(
                    DayOfTheWeekAnalysis.builder()
                            .dayOfTheWeek(dayOfWeek.toString())
                            .totalOrder(0)
                            .totalTransaction(BigDecimal.ZERO)
                            .build());
        }

    }


}
