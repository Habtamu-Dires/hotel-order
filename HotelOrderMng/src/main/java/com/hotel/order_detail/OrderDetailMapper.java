package com.hotel.order_detail;

import com.hotel.item.ItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderDetailMapper {

    private final ItemMapper itemMapper;

    public OrderDetailDTO toOrderDetailDTO(OrderDetail orderDetail) {
        return OrderDetailDTO.builder()
                .id(orderDetail.getId().toString())
                .orderId(orderDetail.getOrder().getId().toString())
                .itemId(orderDetail.getItem().getId().toString())
                .quantity(orderDetail.getQuantity())
                .type(orderDetail.getType())
                .note(orderDetail.getNote())
                .status(orderDetail.getStatus())
                .build();
    }

    public OrderDetail toOrderDetail(OrderDetailDTO orderDetailDTO) {
        return  OrderDetail.builder()
                .quantity(orderDetailDTO.quantity())
                .type(orderDetailDTO.type())
                .note(orderDetailDTO.note())
                .status(orderDetailDTO.status())
                .build();
    }
}
