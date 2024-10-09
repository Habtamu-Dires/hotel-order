package com.hotel.category;

import com.hotel.item.Item;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@Entity
@Table(name = "category")
public class Category {
    @Id
    private UUID id;
    @Column(unique = true)
    private String name;
    private String imageUrl;

    @OneToMany(mappedBy = "category")
    private List<Item> items;

    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL)
    private List<Category> subCategories;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parentCategory;
}
