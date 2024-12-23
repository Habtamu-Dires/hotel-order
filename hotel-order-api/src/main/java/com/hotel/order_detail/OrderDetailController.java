package com.hotel.order_detail;

import com.hotel.common.IdResponse;
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
    public ResponseEntity<IdResponse> updateOrderDetailStatus(
            @PathVariable("detail-id") String detailId,
            @RequestParam String status
    ){
        return  ResponseEntity.ok(service.updateOrderDetailStatus(detailId,status));
    }

}
