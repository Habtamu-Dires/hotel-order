package com.hotel.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class User {
    private Integer id;
    private String name;
    private String phoneNumber;
    private String status;
}
