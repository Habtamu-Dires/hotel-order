package com.hotel.order_detail;

import com.hotel.order.ItemOrder;
import com.hotel.item.Item;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@Entity
@Table(name = "order_detail")
public class OrderDetail {
    @Id
    private UUID id;
    private Integer quantity;
    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;
    @ManyToOne
    @JoinColumn(name = "item_order")
    private ItemOrder order;
    @Enumerated(EnumType.STRING)
    private DetailStatus status;
    private String type;
    private String note;

}
