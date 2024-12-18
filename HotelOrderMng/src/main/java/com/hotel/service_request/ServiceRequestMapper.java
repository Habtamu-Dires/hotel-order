package com.hotel.service_request;

import com.hotel.location.OrderLocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ServiceRequestMapper {

    private final OrderLocationMapper locationMapper;

    public ServiceRequestResponse toServiceRequestReponse(ServiceRequest request) {
        return   ServiceRequestResponse.builder()
                .id(request.getId().toString())
                .locationId(request.getOrderLocation().getId().toString())
                .location(locationMapper.toOrderLocationResponse(request.orderLocation))
                .serviceType(request.serviceType)
                .serviceStatus(request.serviceStatus)
                .createdDate(request.createdDate)
                .completedDate(request.completedDate)
                .build();
    }
}
