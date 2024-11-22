package com.hotel.location;

import org.springframework.data.jpa.domain.Specification;

public class LocationSpecification {


    // search by number
    public static Specification<OrderLocation> numberStartsWith(Integer number){
        return (root, query, criteriaBuilder)->{
            if(number == null){
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                    criteriaBuilder.toString(root.get("number")), number + "%");
        };
    }

    // search by type
    public static Specification<OrderLocation> typeIs(LocationType type){
        return (root, query, criteriaBuilder)->{
            if(type == null){
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("type"), type);
        };
    }
}
