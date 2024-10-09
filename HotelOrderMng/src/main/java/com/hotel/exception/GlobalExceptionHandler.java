package com.hotel.exception;

import com.hotel.api_response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceAlreadyTakenException.class)
    public ResponseEntity<ApiResponse<String>> handle(ResourceAlreadyTakenException ex){
        ApiResponse<String> res = new ApiResponse<>(
                false,null,ex.getMessage());

        return ResponseEntity.status(HttpStatus.ALREADY_REPORTED)
                .body(res);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handle(ResourceNotFoundException ex){
        ApiResponse<String> res = new ApiResponse<>(
                false,null,ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(res);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handle(Exception ex){
        ApiResponse<String> res = new ApiResponse<>(
                false,null,ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(res);
    }
}
