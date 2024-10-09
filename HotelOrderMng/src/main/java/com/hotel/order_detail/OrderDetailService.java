package com.hotel.order_detail;

import com.hotel.exception.ResourceNotFoundException;
import com.hotel.item.Item;
import com.hotel.item.ItemService;
import com.hotel.order.ItemOrder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderDetailService {

    private final OrderDetailRepository repository;
    private final OrderDetailMapper mapper;
    private final ItemService itemService;

    //create order detail , without saving to the database
    public OrderDetail createOrderDetail(OrderDetailDTO orderDetailDTO, ItemOrder order) {
        //check if the item exist.
        Item item = itemService
            .findItemById(UUID.fromString(orderDetailDTO.itemId()))
            .orElseThrow(() -> new ResourceNotFoundException("Item not Found"));
        //check if item is available
        if(!itemService.isItemAvailable(item, orderDetailDTO.quantity())){
            throw new ResourceNotFoundException("Item not available now");
        }

        OrderDetail orderDetail = mapper.toOrderDetail(orderDetailDTO);

        orderDetail.setStatus(DetailStatus.PENDING);
        orderDetail.setId(UUID.randomUUID());
        orderDetail.setItem(item);
        orderDetail.setOrder(order);
        // just return order detail
      return orderDetail;
    }
}
