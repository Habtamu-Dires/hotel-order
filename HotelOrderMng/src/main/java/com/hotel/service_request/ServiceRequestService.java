package com.hotel.service_request;

import com.hotel.location.OrderLocation;
import com.hotel.location.OrderLocationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServiceRequestService {

    private final ServiceRequestRepository repository;
    private final OrderLocationService locationService;
    private final ServiceRequestMapper mapper;

    public String createRequest(ServiceRequestDTO request) {
    OrderLocation orderLocation = locationService.findOrderLocationById(request.locationId());
    // avoid multiple similar request from the same location
      Optional<ServiceRequest> res = repository.findServiceRequestByLocationId(
                UUID.fromString(request.locationId()),
                request.serviceType()
        );

      if(res.isPresent()){
          return  "Request already made";
      } else {
          repository.save(
                  ServiceRequest.builder()
                          .id(UUID.randomUUID())
                          .orderLocation(orderLocation)
                          .serviceType(request.serviceType())
                          .serviceStatus(request.serviceStatus())
                          .createdDate(LocalDateTime.now())
                          .build()
          );
          return String.format("%s request successfully send", request.serviceType());
      }
    }


    // get all service request DTO
    @Secured({"ROLE_ADMIN", "ROLE_WAITER"})
    public List<ServiceRequestDTO> getAllServiceRequests() {
        return  repository.findAll().stream()
                .map(mapper::toServiceRequestDTO)
                .toList();
    }

    // get pending service requests
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public List<ServiceRequestDTO> getPendingServiceRequests() {
        return repository.getPendingServiceRequests()
                .stream()
                .map(mapper::toServiceRequestDTO)
                .toList();
    }

    // update service request
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public String updateServiceRequestStatus(String requestId) {
       var request = this.findServiceRequestById(requestId);

       request.setServiceStatus(ServiceStatus.COMPLETED);

       return repository.save(request).getId().toString();
    }

    //find service by id
    public ServiceRequest findServiceRequestById(String serviceId){
        return  repository.findById(UUID.fromString(serviceId))
                .orElseThrow(() -> new EntityNotFoundException(
                        "Service Request not found"
                ));
    }
}
