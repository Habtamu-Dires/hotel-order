package com.hotel.role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Integer> {

    @Modifying
    @Query(value = "LOCK TABLE role IN ACCESS EXCLUSIVE MODE", nativeQuery = true)
    void lockRoleTable();

    @Query("SELECT r FROM Role r WHERE r.name = :name")
    Optional<Role> findByName(RoleType name);
}
