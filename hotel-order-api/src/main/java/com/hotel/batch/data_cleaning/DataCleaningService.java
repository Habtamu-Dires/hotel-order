package com.hotel.batch.data_cleaning;

import org.springframework.stereotype.Service;

@Service
public class DataCleaningService {

    public String getNameOfCleanCanceledOrderJob(){
        return "cleanCanceledOrderJob";
    }

    public String getNameOfCleanServiceRequestJob(){
        return "cleanServiceRequestJob";
    }
}
