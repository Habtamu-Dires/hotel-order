package com.hotel.batch.monthly_order_data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface MonthlyOrderDataRepository extends JpaRepository<MonthlyOrderData, Integer> {

    @Modifying
    @Query(value = """
            INSERT INTO monthly_order_data  (year, month, total_order, total_transaction)
            VALUES (:year, :month, :totalOrder, :totalTransaction) 
            ON CONFLICT (year, month) DO UPDATE
            SET total_order =  monthly_order_data.total_order + :totalOrder,
               total_transaction = monthly_order_data.total_transaction + :totalTransaction
            """,
            nativeQuery = true)
    void upsertMonthlyData(@Param("year") int year,
                           @Param("month") String month,
                           @Param("totalOrder") int totalOrder,
                           @Param("totalTransaction")BigDecimal totalTransaction);


    @Query("SELECT mod FROM MonthlyOrderData mod WHERE mod.year = :year")
    List<MonthlyOrderData> getMonthlyOrderDataForYear(@Param("year") int year);
}
