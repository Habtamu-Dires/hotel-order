package com.hotel.category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID>, JpaSpecificationExecutor<Category> {

    @Query("SELECT c FROM Category c WHERE c.name = :name")
    Optional<Category> findByName(String name);

    @Query("SELECT c FROM Category c WHERE c.parentCategory IS NULL")
    Page<Category> findMainCategory(Pageable pageable);

    @Query("SELECT c FROM Category c WHERE c.parentCategory IS NOT NULL")
    Page<Category> findSubCategory(Pageable pageable);

}
