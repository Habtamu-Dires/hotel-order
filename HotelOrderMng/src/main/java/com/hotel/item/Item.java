package com.hotel.item;

import com.hotel.category.Category;
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
@Table(name = "item")
public class Item {
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
}
