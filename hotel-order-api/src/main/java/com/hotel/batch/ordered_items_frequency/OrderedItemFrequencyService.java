package com.hotel.batch.ordered_items_frequency;

import io.swagger.v3.oas.annotations.servers.Server;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderedItemFrequencyService {

    private final OrderedItemsFrequencyRepository repository;

    public String getName(){
        return "orderedItemFrequencyJob";
    }

    public void deleteAll() {
        repository.deleteAll();
    }
}
