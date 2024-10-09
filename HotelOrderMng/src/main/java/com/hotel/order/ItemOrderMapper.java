package com.hotel.order;

import com.hotel.order_detail.OrderDetailMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemOrderMapper {

    private final OrderDetailMapper orderDetailMapper;

    public ItemOrderDTO toItemOrderDTO(ItemOrder itemOrder) {
        return ItemOrderDTO.builder()
                .orderId(itemOrder.getId().toString())
                .totalPrice(itemOrder.getTotalPrice())
                .orderType(itemOrder.getOrderType())
                .orderDetails(
                    itemOrder.getOrderDetails()
                            .stream()
                            .map(orderDetailMapper::toOrderDetailDTO)
                            .toList()
                )
                .createdAt(itemOrder.getCreatedAt())
                .orderStatus(itemOrder.getOrderStatus())
                .note(itemOrder.getNote())
                .locationId(itemOrder.getOrderLocation().getId().toString())
                .build();
    }

}
