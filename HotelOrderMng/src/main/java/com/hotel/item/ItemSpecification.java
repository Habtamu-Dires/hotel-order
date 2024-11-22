package com.hotel.item;

import com.hotel.category.Category;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ItemSpecification {

    //search item by name and category
    public static Specification<Item> searchItem(String name, String categoryId){
        return (root,query, criteriaBuilder)->{
            List<Predicate> predicates = new ArrayList<>();
            if(name != null && !name.isBlank()){
                Predicate namePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%"+name+"%"
                );
                predicates.add(namePredicate);
            }

            if(categoryId != null && !categoryId.isBlank()){
                UUID id = UUID.fromString(categoryId);
                Predicate categoryPredicate = criteriaBuilder.equal(
                        root.get("Category").get("id"),id);

                predicates.add(categoryPredicate);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
