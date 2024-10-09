package com.hotel.api_response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
}
