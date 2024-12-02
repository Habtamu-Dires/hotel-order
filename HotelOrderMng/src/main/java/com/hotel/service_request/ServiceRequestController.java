package com.hotel.service_request;

import com.hotel.common.MessageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
    public ResponseEntity<MessageResponse> createServiceRequest(
            @RequestBody @Valid ServiceRequestRequest request
    ){
        return ResponseEntity.ok(service.createRequest(request));
    }

    // get pending call requests
    @GetMapping("/pending/call")
    public ResponseEntity<List<ServiceRequestResponse>> getPendingCallRequest(){
        return ResponseEntity.ok(service.getPendingCallRequests());
    }

    // get pending bill requests
    @GetMapping("/pending/bill")
    public ResponseEntity<List<ServiceRequestResponse>> getPendingBillRequest(){
        return ResponseEntity.ok(service.getPendingBillRequests());
    }

    // get all pending service requests
    @GetMapping("/pending")
    public ResponseEntity<List<ServiceRequestResponse>> getPendingServiceRequests(){
        return  ResponseEntity.ok(service.getPendingServiceRequests());
    }

    //get service requests
    @GetMapping
    public ResponseEntity<List<ServiceRequestResponse>> getAllServiceRequests(){
       return ResponseEntity.ok(service.getAllServiceRequests());
    }

    // update service request status
    @PutMapping("/update-status/{request_id}")
    public ResponseEntity<?> updateServiceRequestStatus(
            @PathVariable("request_id") String requestId
    ){
        service.updateServiceRequestStatus(requestId);
        return ResponseEntity.accepted().build();
    }
}
