package com.hotel.location;

import com.hotel.common.BaseEntity;
import com.hotel.order.ItemOrder;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@Entity
@Table(name = "order_location",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"number", "type"})}
)
public class OrderLocation extends BaseEntity {
    @Id
    private UUID id;
    private Integer number;
    @Enumerated(EnumType.STRING)
    private LocationType type;
    private String description;
    private String address;
    @Enumerated(EnumType.STRING)
    private LocationStatus status;
    @OneToMany(mappedBy = "orderLocation")
    private List<ItemOrder> orderList;
}
