package com.hotel.batch.batch_status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.Optional;

public interface BatchStatusRepository extends JpaRepository<BatchStatus,String> {

    @Modifying
    @Query(value = "LOCK TABLE batch_status IN ACCESS EXCLUSIVE MODE", nativeQuery = true)
    void lockTable();
}
