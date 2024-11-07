package com.hotel.batch.ordered_items_frequency;

import com.hotel.item.Item;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "ordered_items_frequency")
public class OrderedItemsFrequency {
    @Id
    @GeneratedValue
    private Integer id;
    private Integer frequency;
    @OneToOne
    @JoinColumn(name = "item_id")
    private Item item;
}
