package com.hotel.order;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendOrderNotification(String role, OrderResponse orderResponse){
        messagingTemplate.convertAndSend(
                "/user/"+role+"/notification",
                orderResponse
        );
    }
}
