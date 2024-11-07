package com.hotel.user;

import jakarta.validation.constraints.NotBlank;

public record SelfProfileUpdateRequest(
        @NotBlank(message = "username is mandatory")
        String username,
        @NotBlank(message = "password is mandatory")
        String password
) {}
