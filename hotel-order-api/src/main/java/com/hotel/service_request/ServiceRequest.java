package com.hotel.service_request;

import com.hotel.location.OrderLocation;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "service_request")
@EntityListeners(AuditingEntityListener.class)
public class ServiceRequest {
    @Id
    UUID id;
    @ManyToOne
    @JoinColumn(name = "location_id")
    OrderLocation orderLocation;
    @Enumerated(value = EnumType.STRING)
    ServiceType serviceType;
    @Enumerated(value = EnumType.STRING)
    ServiceStatus serviceStatus;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    LocalDateTime createdDate;
    @LastModifiedDate
    @Column(insertable = false)
    LocalDateTime completedDate;
}
