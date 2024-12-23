package com.hotel.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

public enum BusinessErrorCode {

    ACCOUNT_LOCKED(423,FORBIDDEN,"User account is locked"),
    BAD_CREDENTIAL(401, UNAUTHORIZED, "username or password incorrect")

    ;
    @Getter
    private final int code;
    @Getter
    private final HttpStatus httpStatus;
    @Getter
    private final String description;

    BusinessErrorCode(int code, HttpStatus httpStatus, String description){
        this.code = code;
        this.httpStatus=httpStatus;
        this.description=description;
    }
}
