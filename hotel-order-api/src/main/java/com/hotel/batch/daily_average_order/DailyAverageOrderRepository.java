package com.hotel.batch.daily_average_order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface DailyAverageOrderRepository extends JpaRepository<DailyAverageOrder, Integer> {
    @Modifying
    @Query(value = """
            INSERT INTO daily_average_order (id, total_order, total_transaction)
            VALUES (:id, :totalOrder, :totalTransaction)
            ON CONFLICT (id) DO UPDATE
            SET total_order = daily_average_order.total_order + :totalOrder,
                total_transaction = daily_average_order.total_transaction + :totalTransaction
            """,
            nativeQuery = true)
    void upsertDailyAverageOrder(@Param("id") Integer id,
                                 @Param("totalOrder") Integer totalOrder,
                                 @Param("totalTransaction") BigDecimal totalTransaction);

    @Modifying
    @Query("UPDATE DailyAverageOrder d " +
            "SET d.totalOrder = d.totalOrder + :totalOrder, " +
            "d.totalTransaction = d.totalTransaction + :totalTransaction " +
            "WHERE d.id = :id")
    void updateDailyAverageOrder(@Param("id") Integer id,
                                 @Param("totalOrder") Integer totalOrder,
                                 @Param("totalTransaction") BigDecimal totalTransaction);


}
