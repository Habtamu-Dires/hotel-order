package com.hotel.item;

import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequency;
import com.hotel.category.Category;
import com.hotel.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
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
    private Integer popularityIndex=0;

    @ManyToMany(mappedBy = "items",fetch = FetchType.EAGER)
    private List<Category> categories;

    @OneToOne(mappedBy = "item")
    private OrderedItemsFrequency frequency;

    public void addCategory(Category category){
        this.categories.add(category);
        category.getItems().add(this);
    }

    public void removeCategory(Category category){
        this.categories.remove(category);
        category.getItems().remove(this);
    }
}
