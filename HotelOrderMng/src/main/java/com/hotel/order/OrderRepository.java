package com.hotel.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<ItemOrder, UUID> {

    @Query("SELECT io FROM ItemOrder io WHERE io.orderStatus = 'PENDING'")
    List<ItemOrder> findPendingOrders();

    @Query("""
            SELECT io FROM ItemOrder io 
            WHERE io.orderStatus <> 'COMPLETED' AND
            io.orderStatus <> 'CANCELED'
            """)
    List<ItemOrder> findActiveOrders();

    @Query("SELECT io FROM ItemOrder io WHERE io.orderStatus = :status")
    List<ItemOrder> findOrdersByStatus(OrderStatus status);

    @Query("SELECT io FROM ItemOrder io WHERE io.orderLocation.id = :locationId")
    List<ItemOrder> findOrdersByLocationId(UUID locationId);

    @Query("SELECT io FROM ItemOrder io WHERE io.orderStatus = 'SERVED'")
    List<ItemOrder> findAllServedOrders();

    @Query("""
            SELECT io FROM ItemOrder io
            WHERE io.createdDate > :dateTime 
            AND io.orderStatus = 'COMPLETED'
            """)
    List<ItemOrder> findCompletedOrdersAfter(LocalDateTime dateTime);

    @Query("""
            SELECT io FROM ItemOrder io
            WHERE io.createdDate > :dateTime 
            AND io.orderStatus = 'COMPLETED'
            """)
    Page<ItemOrder> getPageableCompletedOrdersAfter(LocalDateTime dateTime, Pageable pageable);

    @Query("""
            SELECT io FROM ItemOrder io
            WHERE io.createdDate > :afterTime
            AND io.createdDate < :beforeTime
            AND io.orderStatus = 'COMPLETED'
            """)
    Page<ItemOrder> getPageableCompletedOrdersAfterBefore(LocalDateTime afterTime,
                                                          LocalDateTime beforeTime,
                                                          Pageable pageable);

    @Query("""
            SELECT io FROM ItemOrder io
            WHERE io.createdDate < :beforeTime
            AND io.orderStatus = 'COMPLETED'
            """)
    List<ItemOrder> getCompletedOrdersBefore(LocalDateTime beforeTime);

    @Query("""
            SELECT COUNT(*) FROM ItemOrder io
            WHERE io.createdDate > :dateTime
            AND io.orderStatus = 'COMPLETED'
            """)
    Integer findNumberOfCompletedOrdersAfter(LocalDateTime dateTime);

    @Query(" SELECT io FROM ItemOrder io WHERE io.orderStatus = 'CANCELED' ")
    Page<ItemOrder> getCanceledOrders(Pageable pageable);
    @Query("""
            SELECT o FROM ItemOrder o WHERE o.orderLocation.id = :locationId
            AND o.createdDate > :date
            AND  o.orderStatus <> 'COMPLETED'
            AND o.orderStatus <> 'CANCELED'
            """)
    List<ItemOrder> NonCompletedOrdersOfTodayByLocation(UUID locationId, LocalDateTime date);
}