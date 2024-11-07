package com.hotel.auth;

import com.hotel.role.RoleType;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.util.List;

@Builder
public record RegistrationRequest(
        @NotEmpty(message = "FirstName is mandatory")
        @NotBlank(message = "FirstName is mandatory")
        String firstName,
        @NotEmpty(message = "LastName is mandatory")
        @NotBlank(message = "LastName is mandatory")
        String lastName,
        @NotEmpty(message = "PhoneNumber is mandatory")
        @NotBlank(message = "PhoneNumber is mandatory")
        @Size(min=10, max = 12)
        String phoneNumber,
        @NotEmpty(message = "username is mandatory")
        @NotBlank(message = "username is mandatory")
        String username,
        @NotEmpty(message = "Password is mandatory")
        @NotBlank(message = "Password is mandatory")
        @Size(min = 4, message = "Password should be 4 character minimum")
        String password,
        String email,
        @NotNull(message = "At lest one role must be assigned")
        List<RoleType> roles
) {
}
