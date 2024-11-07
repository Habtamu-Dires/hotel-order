package com.hotel.batch.monthly_order_data;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "monthly_order_data", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"year", "month"})
})
public class MonthlyOrderData {

    @Id
    @GeneratedValue
    private Integer id;
    private Integer year;
    private String month;
    private Integer totalOrder;
    private BigDecimal totalTransaction;

}
