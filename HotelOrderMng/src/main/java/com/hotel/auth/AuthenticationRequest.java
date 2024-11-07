package com.hotel.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record AuthenticationRequest(
        @NotBlank(message = "Username is Mandatory")
        String username,
        @NotBlank(message = "Password is Mandatory")
        String password
) {
}
