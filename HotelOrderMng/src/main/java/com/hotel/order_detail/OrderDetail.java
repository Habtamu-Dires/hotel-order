package com.hotel.order_detail;

import com.hotel.order.ItemOrder;
import com.hotel.item.Item;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@Entity
@Table(name = "order_detail")
@EntityListeners(AuditingEntityListener.class)
public class OrderDetail {
    @Id
    private UUID id;
    private Integer quantity;
    @Enumerated(EnumType.STRING)
    private DetailStatus status;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToOne
    @JoinColumn(name = "item_order")
    private ItemOrder order;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedBy
    @Column(insertable = false)
    private String lastModifiedBy;

}
