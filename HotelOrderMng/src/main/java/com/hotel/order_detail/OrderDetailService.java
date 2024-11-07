package com.hotel.order_detail;

import com.hotel.exception.OperationNotPermittedException;
import com.hotel.item.Item;
import com.hotel.item.ItemService;
import com.hotel.order.ItemOrder;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderDetailService {

    private final OrderDetailRepository repository;
    private final OrderDetailMapper mapper;
    private final ItemService itemService;

    //create order detail , without saving to the database
    public OrderDetail createOrderDetail(OrderDetailRequest request, ItemOrder order) {
        //check if the item exist.
        Item item = itemService.findItemById(request.itemId());
        //check if item is available
        if(!itemService.isItemAvailable(item, request.quantity())){
            throw new OperationNotPermittedException("Not enough item available now");
        }

       return OrderDetail.builder()
                .id(UUID.randomUUID())
                .item(item)
                .order(order)
                .quantity(request.quantity())
                .status(request.status())
                .build();
    }

    @Secured({"ROLE_ADMIN", "ROLE_CHEF", "ROLE_BARISTA"})
    public String updateOrderDetailStatus(String detailId,
                                                          DetailStatus status) {
        OrderDetail orderDetail = this.findById(detailId);
        orderDetail.setStatus(status);
        return repository.save(orderDetail).getId().toString();
    }

    //find by id
    public OrderDetail findById(String id){
        return repository.findById(UUID.fromString(id))
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("OrderDetail with id:: %s not found", id)));
    }
}
