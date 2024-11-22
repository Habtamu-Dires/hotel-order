package com.hotel.item;

import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequency;
import com.hotel.category.Category;
import com.hotel.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@Entity
@Table(name = "item",
        indexes = {@Index(name = "idx_item_name", columnList = "name")}
)
public class Item extends BaseEntity {
    @Id
    private UUID id;
    private String name;
    private String imageUrl;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private boolean isAvailable = true;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToOne(mappedBy = "item")
    private OrderedItemsFrequency frequency;
}
