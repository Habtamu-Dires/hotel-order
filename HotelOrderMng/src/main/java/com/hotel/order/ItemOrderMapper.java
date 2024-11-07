package com.hotel.order;

import com.hotel.order_detail.OrderDetailMapper;
import com.hotel.location.OrderLocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemOrderMapper {

    private final OrderDetailMapper orderDetailMapper;
    private final OrderLocationMapper locationMapper;

    public ItemOrderResponse toItemOrderResponse(ItemOrder itemOrder) {
        return ItemOrderResponse.builder()
                .id(itemOrder.getId().toString())
                .totalPrice(itemOrder.getTotalPrice())
                .orderType(itemOrder.getOrderType())
                .orderDetails(
                    itemOrder.getOrderDetails()
                            .stream()
                            .map(orderDetailMapper::toOrderDetailDTO)
                            .toList()
                )
                .createdAt(itemOrder.getCreatedDate())
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
