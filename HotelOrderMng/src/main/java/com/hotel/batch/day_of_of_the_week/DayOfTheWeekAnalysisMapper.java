package com.hotel.batch.day_of_of_the_week;

public class DayOfTheWeekAnalysisMapper {

    public static DayOfTheWeekAnalysisResponse toDayOfTheWeekResponse(
            DayOfTheWeekAnalysis dayOfTheWeekAnalysis
    ) {
        return DayOfTheWeekAnalysisResponse.builder()
                .dayOfTheWeek(dayOfTheWeekAnalysis.getDayOfTheWeek())
                .averageOrder(dayOfTheWeekAnalysis.getTotalOrder() / 4.0)
                .averageTransaction(dayOfTheWeekAnalysis.getTotalTransaction().doubleValue() / 4.0)
                .build();
    }
}
