package com.hotel.batch.daily_average_order;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "daily_average_order")
public class DailyAverageOrder {

    @Id
    private Integer id;
    private Integer totalOrder;
    private BigDecimal totalTransaction;

}
