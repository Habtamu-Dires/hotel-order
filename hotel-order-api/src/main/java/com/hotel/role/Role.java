package com.hotel.role;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hotel.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "role")
@Entity
public class Role {

    @Id
    @GeneratedValue
    private Integer id;
    @Enumerated(EnumType.STRING)
    @Column(unique = true)
    private RoleType name;

    @ManyToMany (mappedBy = "roles")
    @JsonIgnore
    private List<User> users;

}
