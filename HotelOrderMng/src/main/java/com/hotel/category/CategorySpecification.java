package com.hotel.category;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CategorySpecification {

    public static Specification<Category> searchCategory(String name, String filter){
        return (root,query, criteriaBuilder)->{
            List<Predicate> predicates = new ArrayList<>();
            if(name != null && !name.isBlank()){
                Predicate namePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%"+name.toLowerCase()+"%"
                );
                predicates.add(namePredicate);
            }
            if(filter != null && !filter.isBlank() && !filter.equals("All")){
                if(filter.equals("Main")){
                    Predicate mainPredicate = criteriaBuilder
                            .isNull(root.get("parentCategory"));
                    predicates.add(mainPredicate);
                } else if(filter.equals("Sub")){
                    Predicate subPredicate = criteriaBuilder
                            .isNotNull(root.get("parentCategory"));
                    predicates.add(subPredicate);
                }
            }
             return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
