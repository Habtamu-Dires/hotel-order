package com.hotel.batch.day_of_of_the_week;

import com.hotel.order.ItemOrder;
import com.hotel.order.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
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
        //get data before 28 day
        var midNight = LocalDateTime.of(LocalDate.now(),LocalTime.MIDNIGHT);
        List<ItemOrder> oldList = orderRepository.getCompletedOrdersBefore(midNight.minusDays(28));
        //totalOrders
        Integer totalOrder =  oldList.size();
        //total transaction
        BigDecimal totalTransaction = oldList.stream()
                .map(ItemOrder::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        // day of the week
        DayOfWeek dayOfWeek = oldList.getFirst().getCreatedDate().getDayOfWeek();

        // get data by dayOfTheWeek
       DayOfTheWeekAnalysis dayOfTheWeekAnalysis =  repository.getByDayOfTheWeek(dayOfWeek.toString())
               .orElseThrow(() -> new EntityNotFoundException("Entity not found "));

        // update / reduce the totals
        dayOfTheWeekAnalysis.setTotalOrder(dayOfTheWeekAnalysis.getTotalOrder() - totalOrder);
        BigDecimal newTotalTransaction = dayOfTheWeekAnalysis.getTotalTransaction().subtract(totalTransaction);
        dayOfTheWeekAnalysis.setTotalTransaction(newTotalTransaction);

        // save
        repository.save(dayOfTheWeekAnalysis);

    }


}
