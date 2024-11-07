package com.hotel.batch.daily_average_order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface DailyAverageOrderRepository extends JpaRepository<DailyAverageOrder, Integer> {
    @Modifying
    @Query(value = """
            INSERT into daily_average_order  (total_order,total_transaction)
            VALUES (:id :totalOrder, :totalTransaction)
            ON CONFLICT (id) DO UPDATE
            SET total_orders =  daily_average_order.total_order + :totalOrder,
            total_transaction = daily_average_order.total_transaction + :totalTransaction
            """,
            nativeQuery = true)
    void upsertDailyAverageOrder(@Param("id") Integer id,
                                 @Param("totalOrder") Integer totalOrder,
                                 @Param("totalTransaction") BigDecimal totalTransaction);

}
