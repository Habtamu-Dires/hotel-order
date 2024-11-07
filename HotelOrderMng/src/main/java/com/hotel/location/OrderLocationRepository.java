package com.hotel.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface OrderLocationRepository extends JpaRepository<OrderLocation, UUID> {

    @Query("SELECT ol FROM OrderLocation ol WHERE ol.status = 'READY'")
    List<OrderLocation> findReadyRooms();

    @Query("SELECT ol FROM OrderLocation ol WHERE ol.type = 'ROOM'")
    List<OrderLocation> findAllRooms();

    @Query("SELECT ol FROM OrderLocation ol WHERE ol.type = 'TABLE'")
    List<OrderLocation> findAllTables();
}
