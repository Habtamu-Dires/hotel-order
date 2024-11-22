package com.hotel.category;

import com.hotel.common.BaseEntity;
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

    @OneToMany(mappedBy = "category")
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
}
