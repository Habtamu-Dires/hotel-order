package com.hotel.order;

import com.hotel.location.OrderLocation;
import com.hotel.order_detail.OrderDetail;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@Entity
@Table(name = "item_order")
@EntityListeners(AuditingEntityListener.class)
public class  ItemOrder{
    @Id
    private UUID id;
    private BigDecimal totalPrice;
    @Enumerated(EnumType.STRING)
    private OrderType orderType;
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;
    private String note;

    @OneToMany(mappedBy = "order", fetch = FetchType.EAGER, cascade = {CascadeType.ALL} , orphanRemoval = true)
    private List<OrderDetail> orderDetails;
    @ManyToOne
    @JoinColumn(name = "order_location")
    private OrderLocation orderLocation;

    @CreatedDate
    @Column( nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedBy
    @Column(insertable = false)
    private String lastModifiedBy;

}
