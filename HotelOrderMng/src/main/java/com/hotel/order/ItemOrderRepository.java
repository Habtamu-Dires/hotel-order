package com.hotel.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ItemOrderRepository extends JpaRepository<ItemOrder, UUID> {

    @Query("SELECT io FROM ItemOrder io WHERE io.orderStatus = :PENDING")
    List<ItemOrder> findPendingOrders();
}
