package com.hotel.location;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record OrderLocationRequest(
        String id,
        @NotNull(message = "Location number is mandatory")
        @Positive(message = "Location number is not acceptable")
        Integer number,
        @NotNull(message = "Location type is mandatory")
        LocationType type,
        @NotNull(message = "Description type is mandatory")
        String description,
        @NotBlank(message = "Address is mandatory")
        String address,
        @NotNull(message = "Location status is mandatory")
        LocationStatus status
) {}
