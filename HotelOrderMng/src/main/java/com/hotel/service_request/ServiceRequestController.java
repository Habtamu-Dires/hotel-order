package com.hotel.service_request;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service-requests")
@RequiredArgsConstructor
@Tag(name = "service-requests")
public class ServiceRequestController {

    private final ServiceRequestService service;

    //create new service request
    @PostMapping
    public ResponseEntity<String> createServiceRequest(
            @RequestBody ServiceRequestDTO requestDTO
    ){
       return ResponseEntity.ok(service.createRequest(requestDTO));
    }

    // get all pending service requests
    @GetMapping("/pending")
    public ResponseEntity<List<ServiceRequestDTO>> getPendingServiceRequests(){
        return  ResponseEntity.ok(service.getPendingServiceRequests());
    }

    //get service requests
    @GetMapping
    public ResponseEntity<List<ServiceRequestDTO>> getAllServiceRequests(){
       return ResponseEntity.ok(service.getAllServiceRequests());
    }

    // update service request status
    @PutMapping("/update-status/{request_id}")
    public ResponseEntity<?> updateServiceRequestStatus(
            @PathVariable("request_id") String request_id
    ){
       return ResponseEntity.ok(service.updateServiceRequestStatus(request_id));
    }
}
