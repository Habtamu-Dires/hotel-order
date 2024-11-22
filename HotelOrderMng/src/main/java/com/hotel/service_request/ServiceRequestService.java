package com.hotel.service_request;

import com.hotel.common.MessageResponse;
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

    public MessageResponse createRequest(ServiceRequestRequest request) {
        ServiceType serviceType = changeToServiceType(request.serviceType());
        OrderLocation orderLocation = locationService.findOrderLocationById(request.locationId());
        // avoid multiple similar request from the same location, with in small time frame
        Optional<ServiceRequest> res =
                repository.findPotentialDuplicatedRequest(
                UUID.fromString(request.locationId()),
                serviceType,LocalDateTime.now().minusMinutes(5));

      if(res.isPresent()){
          return  new MessageResponse("Request already made");
      } else {
          repository.save(
                  ServiceRequest.builder()
                          .id(UUID.randomUUID())
                          .orderLocation(orderLocation)
                          .serviceType(serviceType)
                          .serviceStatus(ServiceStatus.PENDING)
                          .createdDate(LocalDateTime.now())
                          .build()
          );
      }
      return new MessageResponse(request.serviceType() + " successfully made");
    }

    // change string to service request type
    private ServiceType changeToServiceType(String type){
        ServiceType serviceType = null;
        try {
            serviceType = ServiceType.valueOf(type);
        } catch (Exception e){
            throw new IllegalArgumentException("unknown service type");
        }
        return  serviceType;
    }


    // get all service request DTO
    @Secured({"ROLE_ADMIN", "ROLE_WAITER"})
    public List<ServiceRequestResponse> getAllServiceRequests() {
        return  repository.findAll().stream()
                .map(mapper::toServiceRequestDTO)
                .toList();
    }

    // get pending service requests
    @Secured({"ROLE_ADMIN","ROLE_WAITER"})
    public List<ServiceRequestResponse> getPendingServiceRequests() {
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
