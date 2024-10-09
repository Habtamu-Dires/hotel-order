package com.hotel.order;

import com.hotel.order_location.OrderLocation;
import com.hotel.order_detail.OrderDetail;
import jakarta.persistence.*;
import lombok.*;

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
public class  ItemOrder{
    @Id
    private UUID id;
    private BigDecimal totalPrice;
    @Enumerated(value = EnumType.STRING)
    private OrderType orderType;
    @Enumerated(value = EnumType.STRING)
    private OrderStatus orderStatus;
    @OneToMany(mappedBy = "order", cascade = {CascadeType.ALL} , orphanRemoval = true)
    private List<OrderDetail> orderDetails;
    @ManyToOne
    @JoinColumn(name = "order_location")
    private OrderLocation orderLocation;
    private String note;
    private LocalDateTime createdAt;
}
