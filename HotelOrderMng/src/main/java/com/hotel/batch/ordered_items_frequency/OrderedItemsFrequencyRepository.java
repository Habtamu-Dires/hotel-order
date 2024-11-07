package com.hotel.batch.ordered_items_frequency;

import com.hotel.item.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderedItemsFrequencyRepository extends JpaRepository<OrderedItemsFrequency, Integer> {

    @Modifying
    @Query(value = """
            INSERT INTO ordered_items_frequency (frequency, item)
            VALUES (:frequency, :item) 
            ON CONFLICT (item) DO UPDATE
            SET frequency = ordered_items_frequency.frequency + :frequency
            """,
            nativeQuery = true)
    void upsertItemFrequency(@Param("frequency") Integer frequency,
                             @Param("item")Item item);

}
