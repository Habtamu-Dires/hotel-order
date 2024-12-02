package com.hotel.batch.daily_average_order;

import com.hotel.order.ItemOrder;
import com.hotel.order.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyAverageOrderService {

    private final OrderRepository orderRepository;
    private final DailyAverageOrderRepository repository;

    public void removeDataBefore7Days(){
        LocalDateTime midnight = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        List<ItemOrder> oldList = orderRepository.getCompletedOrdersBefore(midnight.minusDays(7));

        //total number of orders
        Integer totalOrder = oldList.size();

        //total transaction
        BigDecimal totalTransaction = oldList.stream()
                .map(ItemOrder::getTotalPrice)
                .reduce(BigDecimal.ZERO,BigDecimal::add);

        //get the only row in the database
        DailyAverageOrder savedData = repository.findById(1)
                .orElseThrow(() -> new EntityNotFoundException("Entity not found"));

        savedData.setTotalOrder(savedData.getTotalOrder() - totalOrder);

        var newTotalTransaction = savedData.getTotalTransaction().subtract(totalTransaction);
        savedData.setTotalTransaction(newTotalTransaction);

        // update the data
        repository.save(savedData);

    }
}
