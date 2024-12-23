package com.hotel.category;

import com.hotel.common.BaseEntity;
import com.hotel.item.Item;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Setter
@Getter
@Entity
@Table(name = "category",
        indexes = { @Index(name = "idx_category_name", columnList = "name")}
)
public class Category  extends BaseEntity {

    @Id
    private UUID id;
    @Column(unique = true)
    private String name;
    private String description;
    private String imageUrl;
    private Integer popularityIndex = 0;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "category_items",
        joinColumns = @JoinColumn(name = "category_id"),
        inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<Item> items;

    @OneToMany(mappedBy = "parentCategory")
    private List<Category> subCategories;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parentCategory;

    //helper method
    public void addSubCategory(Category subCategory){
        subCategories.add(subCategory);
        subCategory.setParentCategory(this);
    }

    // helper method add items
    public void addItem(Item item){
        items.add(item);
        item.getCategories().add(this);
    }

    // helper method remove item
    public void removeItem(Item item){
        items.remove(item);
        item.getCategories().remove(this);
    }
}
