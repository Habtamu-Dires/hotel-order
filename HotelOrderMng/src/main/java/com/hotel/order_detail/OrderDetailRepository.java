package com.hotel.order_detail;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.UUID;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, UUID> {

    @Query("""
            SELECT od FROM OrderDetail od
            WHERE od.order.orderStatus = 'COMPLETED'
            AND od.createdDate > :dateTime
            """)
    Page<OrderDetail> getCompletedOrderDetailAfter(LocalDateTime dateTime,
                                                   Pageable pageable);
}
