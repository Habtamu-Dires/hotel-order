package com.hotel.order;

import com.hotel.order_detail.OrderDetailMapper;
import com.hotel.location.OrderLocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderMapper {

    private final OrderDetailMapper orderDetailMapper;
    private final OrderLocationMapper locationMapper;

    public OrderResponse toItemOrderResponse(ItemOrder itemOrder) {
        return OrderResponse.builder()
                .id(itemOrder.getId().toString())
                .totalPrice(itemOrder.getTotalPrice())
                .orderType(itemOrder.getOrderType())
                .orderDetails(
                    itemOrder.getOrderDetails()
                            .stream()
                            .map(orderDetailMapper::toOrderDetailDTO)
                            .toList()
                )
                .createdDate(itemOrder.getCreatedDate())
                .orderStatus(itemOrder.getOrderStatus())
                .note(itemOrder.getNote())
                .location(
                        locationMapper.toOrderLocationResponse(
                                itemOrder.getOrderLocation())
                        )
                .locationId(itemOrder.getOrderLocation().getId().toString())
                .build();
    }

}
