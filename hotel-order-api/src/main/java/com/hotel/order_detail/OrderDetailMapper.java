package com.hotel.order_detail;

import com.hotel.item.ItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderDetailMapper {

    private final ItemMapper itemMapper;

    public OrderDetailResponse toOrderDetailDTO(OrderDetail orderDetail) {
        return OrderDetailResponse.builder()
                .id(orderDetail.getId().toString())
                .orderId(orderDetail.getOrder().getId().toString())
                .itemId(orderDetail.getItem().getId().toString())
                .itemName(orderDetail.getItem().getName())
                .price(orderDetail.getItem().getPrice())
                .quantity(orderDetail.getQuantity())
                .status(orderDetail.getStatus().toString())
                .build();
    }

}
