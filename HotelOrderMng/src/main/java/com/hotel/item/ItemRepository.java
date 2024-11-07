package com.hotel.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {

    @Query("SELECT i FROM Item i WHERE i.isAvailable = true")
    List<Item> findAvailableItems();

    @Query("SELeCT i FROM Item i WHERE i.category.id = :categoryId")
    List<Item> findItemByCategoryId(UUID categoryId);
}
