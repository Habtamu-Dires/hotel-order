package com.hotel.user;

import lombok.Builder;

import java.util.List;

@Builder
public record UserResponse(
        String id,
        String username,
        String password,
        String firstName,
        String lastName,
        String phoneNumber,
        String email,
        String imageUrl,
        boolean accountLocked,
        List<String> roles
)
{}
