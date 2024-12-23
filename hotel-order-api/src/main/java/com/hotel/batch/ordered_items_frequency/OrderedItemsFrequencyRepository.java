package com.hotel.batch.ordered_items_frequency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface OrderedItemsFrequencyRepository extends JpaRepository<OrderedItemsFrequency, Integer> {

    @Modifying
    @Query(value = """
            INSERT INTO ordered_items_frequency (frequency, item_id)
            VALUES (:frequency, :item_id)
            ON CONFLICT (item_id) DO UPDATE
            SET frequency = ordered_items_frequency.frequency + :frequency
            """,
            nativeQuery = true)
    void upsertItemFrequency(@Param("frequency") Integer frequency,
                             @Param("item_id") UUID item_id);

}
