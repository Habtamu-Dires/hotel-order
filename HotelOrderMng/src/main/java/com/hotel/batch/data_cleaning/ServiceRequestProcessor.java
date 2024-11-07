package com.hotel.batch.data_cleaning;

import com.hotel.service_request.ServiceRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.item.ItemProcessor;


@RequiredArgsConstructor
public class ServiceRequestProcessor implements ItemProcessor<ServiceRequest,ServiceRequest> {

    @Override
    public ServiceRequest process(ServiceRequest item) throws Exception {
        return item;
    }
}
