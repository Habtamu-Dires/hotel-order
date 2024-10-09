package com.hotel.order_location;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderLocationRepository extends JpaRepository<OrderLocation, UUID> {
}
