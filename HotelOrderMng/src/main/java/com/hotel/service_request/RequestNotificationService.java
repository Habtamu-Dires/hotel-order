package com.hotel.service_request;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RequestNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendServiceRequestNotification(String role, ServiceRequestResponse response){
        this.messagingTemplate.convertAndSend(
                "/user/"+role+"/notification",
                response
        );

    }
}
