package com.hotel.order;

import com.hotel.exception.ResourceNotFoundException;
import com.hotel.order_detail.OrderDetail;
import com.hotel.order_detail.OrderDetailService;
import com.hotel.order_location.OrderLocation;
import com.hotel.order_location.OrderLocationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemOrderService {

    private final ItemOrderRepository repository;
    private final ItemOrderMapper mapper;
    private final OrderLocationService orderLocationService;
    private final OrderDetailService orderDetailService;

    // get all item orders
    public List<ItemOrderDTO> getAllItemOrders() {
        return repository.findAll().stream()
                .map(mapper::toItemOrderDTO)
                .toList();
    }
    // get all pending orders
    public List<ItemOrderDTO> getPendingOrders() {
        return repository.findPendingOrders().stream()
                 .map(mapper::toItemOrderDTO)
                 .toList();

    }
    // update orders
    public ItemOrderDTO updateOrder(ItemOrderDTO itemOrderDTO) {
       ItemOrder order = repository.findById(UUID.fromString(itemOrderDTO.orderId()))
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Order with id %d not found ", itemOrderDTO.orderId())
                ));
        if(!order.getOrderStatus().equals(OrderStatus.SERVED)) {

            //update location
            if (!order.getOrderLocation().getId().toString()
                    .equals(itemOrderDTO.locationId())) {
                OrderLocation orderLocation = orderLocationService.findOrderLocationById(
                                UUID.fromString(itemOrderDTO.locationId()))
                .orElseThrow(() -> new ResourceNotFoundException("Order Location not Found"));
            }
        }
       return mapper.toItemOrderDTO(repository.save(order));

    }
    // create order
    @Transactional
    public void createOrder(ItemOrderDTO itemOrderDTO) {
        //create order
        ItemOrder order = ItemOrder.builder()
                .totalPrice(itemOrderDTO.totalPrice())
                .orderType(itemOrderDTO.orderType())
                .createdAt(LocalDateTime.now())
                .orderStatus(OrderStatus.PENDING)
                .note(itemOrderDTO.note())
                .build();

        //find the order location
       OrderLocation orderLocation = orderLocationService.findOrderLocationById(
                UUID.fromString(itemOrderDTO.locationId())
        )
       .orElseThrow(() -> new ResourceNotFoundException("Order Location not found"));

        order.setOrderLocation(orderLocation);
        order.setId(UUID.randomUUID());

        List<OrderDetail> orderDetailList = new ArrayList<>();
        itemOrderDTO.orderDetails().forEach(orderDetailDTO -> {
           OrderDetail orderDetail = orderDetailService
                   .createOrderDetail(orderDetailDTO,order);
            orderDetailList.add(orderDetail);
        });

        order.setOrderDetails(orderDetailList);

        repository.save(order); // this saves both order and it details
    }

}
