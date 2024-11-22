package com.hotel.user;

import com.hotel.role.Role;
import com.hotel.role.RoleType;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    public static Specification<User> searchUser(String name, RoleType roleName){
        return (root,query,criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if(name != null && !name.isBlank()){
               Predicate firstNamePredicate = criteriaBuilder.like(
                       criteriaBuilder.lower(root.get("firstName")),
                       "%"+name.toLowerCase()+"%");
               Predicate userNamePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("username")),
                       "%"+name.toLowerCase()+"%");
               Predicate namePredicate = criteriaBuilder.or(firstNamePredicate,userNamePredicate);
               predicates.add(namePredicate);
            }
            if(roleName != null){
                // join with roles
                Join<User, Role> roles = root.join("roles");
                Predicate typePredicate = criteriaBuilder
                        .equal(roles.get("name"),roleName);

                predicates.add(typePredicate);
            }
            return  criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    // find by role
    public static Specification<User> findByRole(RoleType roleType){
        return (root, query, criteriaBuilder)->{
            if(roleType == null){
                return criteriaBuilder.conjunction();
            }
            Join<User, Role> roles = root.join("roles");
            return criteriaBuilder.equal(roles.get("name"), roleType);
        };
    }
}
