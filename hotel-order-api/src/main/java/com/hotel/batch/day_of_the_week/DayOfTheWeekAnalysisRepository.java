package com.hotel.batch.day_of_the_week;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface DayOfTheWeekAnalysisRepository extends JpaRepository<DayOfTheWeekAnalysis,Integer> {
    @Modifying
    @Query(value = """
            INSERT INTO day_of_the_week_analysis  (day_of_the_week, total_order, total_transaction)
            VALUES (:dayOfTheWeek, :totalOrder, :totalTransaction)
            ON CONFLICT (day_of_the_week) DO UPDATE
            SET total_order =  day_of_the_week_analysis.total_order + :totalOrder,
                total_transaction = day_of_the_week_analysis.total_transaction + :totalTransaction
            """,
            nativeQuery = true)
    void upsertDayOfTheWeekData(@Param("dayOfTheWeek") String dayOfTheWeek,
                           @Param("totalOrder") Integer totalOrder,
                           @Param("totalTransaction") BigDecimal totalTransaction);


    @Query("SELECT dwa FROM DayOfTheWeekAnalysis dwa WHERE dwa.dayOfTheWeek = :dayOfTheWeek")
    Optional<DayOfTheWeekAnalysis> getByDayOfTheWeek(String dayOfTheWeek);


}
