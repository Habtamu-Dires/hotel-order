package com.hotel.service_request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record ServiceRequestRequest(
        @NotEmpty(message = "Location is mandatory")
        String locationId,
        @NotNull(message = "Service type is mandatory")
        String serviceType
) { }
