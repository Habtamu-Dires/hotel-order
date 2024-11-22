package com.hotel.location;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderLocationRepository extends JpaRepository<OrderLocation, UUID>, JpaSpecificationExecutor<OrderLocation> {

    @Query("SELECT ol FROM OrderLocation ol WHERE ol.status = 'READY'")
    List<OrderLocation> findReadyRooms();

    @Query("""
            SELECT ol FROM OrderLocation ol 
            WHERE ol.number = :number 
            AND ol.type = :type
            """)
    Optional<OrderLocation> findLocationByNumberAndLocationType(Integer number, LocationType type);
}
