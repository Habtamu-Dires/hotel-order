package com.hotel.batch.day_of_the_week;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;

@RequiredArgsConstructor
public class DayOfTheWeekAnalysisWriter implements ItemWriter<DayOfTheWeekAnalysis> {

    private final DayOfTheWeekAnalysisRepository repository;

    @Override
    public void write(Chunk<? extends DayOfTheWeekAnalysis> chunk) throws Exception {
        for(DayOfTheWeekAnalysis data: chunk){
            repository.upsertDayOfTheWeekData(
                    data.getDayOfTheWeek(),
                    data.getTotalOrder(),
                    data.getTotalTransaction()
            );
        }
    }
}
