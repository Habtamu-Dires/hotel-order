package com.hotel.order_detail;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.Table;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order-details")
@RequiredArgsConstructor
@Tag(name = "order-details")
public class OrderDetailController {

    private final OrderDetailService service;

    @PutMapping("/update-status/{detail-id}")
    public ResponseEntity<String> updateOrderDetailStatus(
            @PathVariable("detail-id") String detailId,
            @RequestBody DetailStatus status
    ){
        return  ResponseEntity.ok(service.updateOrderDetailStatus(detailId,status));
    }


}
