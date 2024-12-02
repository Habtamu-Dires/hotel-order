package com.hotel.service_request;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, UUID> {
    @Query("SELECT sr FROM ServiceRequest sr WHERE sr.serviceStatus = 'PENDING'")
    List<ServiceRequest> getPendingServiceRequests();

    
    @Query("""
            SELECT sr FROM ServiceRequest sr
            WHERE sr.orderLocation.id = :location_id 
            AND sr.serviceType = :type
            AND sr.createdDate > :dateTime
            AND sr.serviceStatus = 'PENDING'
            """)
    Optional<ServiceRequest> findPotentialDuplicatedRequest(UUID location_id,
                                                            ServiceType type,
                                                            LocalDateTime dateTime);


    @Modifying
    @Transactional
    @Query("DELETE FROM ServiceRequest sr Where sr.createdDate < :dateTime ")
    void deleteOlderRequests(LocalDateTime dateTime);

    @Query("SELECT sr FROM ServiceRequest sr Where sr.createdDate < :dateTime")
    Page<ServiceRequest> getOldServiceRequests(@Param("dateTime") LocalDateTime dateTime,
                                               Pageable pageable);

    @Query("""
            SELECT sr FROM ServiceRequest sr 
            WHERE sr.serviceType = :serviceType
            AND sr.serviceStatus = :serviceStatus
            """)
    List<ServiceRequest> findRequestByTypeAndStatus(ServiceType serviceType,
                                                            ServiceStatus serviceStatus);
}
