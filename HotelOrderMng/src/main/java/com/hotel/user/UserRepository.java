package com.hotel.user;

import com.hotel.role.RoleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :role")
    Page<User> findUsersByRole(RoleType role, Pageable pageable);

}
