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
@Entity
public class Role {

    @Id
    @GeneratedValue
    private Integer id;
    @Enumerated(EnumType.STRING)
    private RoleType name;

    @ManyToMany (mappedBy = "roles")
    @JsonIgnore
    private List<User> users;

}
