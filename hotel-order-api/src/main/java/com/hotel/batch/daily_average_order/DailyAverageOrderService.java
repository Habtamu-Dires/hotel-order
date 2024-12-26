package com.hotel.batch.daily_average_order;

import com.hotel.order.ItemOrder;
import com.hotel.order.OrderRepository;
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

    public void removeDataBefore7Days() {
        //get the only row in the database
        DailyAverageOrder savedData = repository.findById(1)
                .orElse(null);

        if(savedData != null){
            LocalDateTime midnight = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
            // get orders before 7 days
            List<ItemOrder> oldList = orderRepository.getCompletedOrdersBefore(midnight.minusDays(7));

            if (!oldList.isEmpty()) {
                //total number of orders
                Integer totalOrder = oldList.size();

                //total transaction
                BigDecimal totalTransaction = oldList.stream()
                        .map(ItemOrder::getTotalPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                int newVal = savedData.getTotalOrder() - totalOrder;
                savedData.setTotalOrder(newVal);
                var newTransaction = savedData.getTotalTransaction().subtract(totalTransaction);
                savedData.setTotalTransaction(newTransaction);

                // update the data
                repository.save(savedData);
            }
        } else {
            repository.save(
                    DailyAverageOrder.builder()
                            .id(1)
                            .totalOrder(0)
                            .totalTransaction(BigDecimal.ZERO)
                            .build()
            );
        }
    }

    public String getName(){
        return "dailyAverageOrderJob";
    }
//    public void updateDailyAverageOrder(DailyAverageOrder data) {
//        DailyAverageOrder dailyAverage = repository.findById(1)
//                .orElseThrow(() -> new EntityNotFoundException("No Daily Average Order Entity"));
//
//        int totalOder = dailyAverage.getTotalOrder() + data.getTotalOrder();
//        dailyAverage.setTotalOrder(totalOder);
//        BigDecimal totalTransaction = dailyAverage.getTotalTransaction()
//                .add(data.getTotalTransaction());
//        dailyAverage.setTotalTransaction(totalTransaction);
//        System.out.println("so now the dail averaage data  has total order" + dailyAverage.getTotalOrder());
//
//        repository.save(dailyAverage);
//    }
}
