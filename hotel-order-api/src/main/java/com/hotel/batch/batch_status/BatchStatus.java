package com.hotel.batch.batch_status;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@Entity
@Table(name = "batch_status")
public class BatchStatus {

    @Id
    private String name;
    private LocalDate lastRunDate;
}
