package com.hotel.order_detail;

import com.hotel.common.IdResponse;
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
        //check status


       return OrderDetail.builder()
                .id(UUID.randomUUID())
                .item(item)
                .order(order)
                .quantity(request.quantity())
                .build();
    }

    //convert status from string to DetailStatus
    public DetailStatus convertStatus(String status){
        try{
            return DetailStatus.valueOf(status);
        } catch (Exception e){
            throw new IllegalArgumentException("No such status type found");
        }
    }

    @Secured({"ROLE_ADMIN", "ROLE_CHEF", "ROLE_BARISTA"})
    public IdResponse updateOrderDetailStatus(String detailId,
                                              DetailStatus status) {
        OrderDetail orderDetail = this.findById(detailId);
        orderDetail.setStatus(status);
        String id = repository.save(orderDetail).getId().toString();
        return new IdResponse(id);
    }

    //find by id
    public OrderDetail findById(String id){
        return repository.findById(UUID.fromString(id))
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("OrderDetail with id:: %s not found", id)));
    }
}
