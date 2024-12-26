package com.hotel.batch.batch_status;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class BatchStatusService {

    private final BatchStatusRepository repository;

    public boolean isNotProcessedToday(String batchName){
        LocalDate lastRunDate = repository.findById(batchName)
                .map(BatchStatus::getLastRunDate)
                .orElseGet(()->{
                    log.warn("Batch with name {} not found", batchName);
                    return LocalDate.now();
                });
        return !(lastRunDate.isEqual(LocalDate.now()));
    }

    public void updateLastRunDate(String batchName){
        repository.findById(batchName)
                .ifPresent(status -> {
                    status.setLastRunDate(LocalDate.now());
                    repository.save(status);
                });
    }

    @Transactional
    public void lockTable(){
        repository.lockTable();
    }
}
