package com.hotel.batch.day_of_the_week;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "day_of_the_week_analysis")
public class DayOfTheWeekAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Integer id;
    @Column(unique = true)
    private String dayOfTheWeek;
    private Integer totalOrder;
    private BigDecimal totalTransaction;

}
