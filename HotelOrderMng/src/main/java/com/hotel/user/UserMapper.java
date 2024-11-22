package com.hotel.user;

import com.hotel.role.Role;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

    public UserResponse toUserResponse(User user){
        return UserResponse.builder()
                .id(user.getId().toString())
                .username(user.getUsername())
                .password(user.getPassword())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .accountLocked(user.isAccountLocked())
                .roles(user.getRoles().stream()
                        .map(role->role.getName().toString())
                        .toList()
                )
                .imageUrl(user.getImageUrl())
                .build();
    }
}
