package com.hotel.exception;

public class ResourceAlreadyTakenException extends RuntimeException{
   public ResourceAlreadyTakenException(String message){
        super(message);
    }
}
