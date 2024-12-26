package com.hotel.batch.monthly_order_data;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MonthlyOrderDataService {


    public String getName(){
        return "monthlyOrderDataJob";
    }
}
