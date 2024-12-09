package com.hotel.batch.day_of_the_week;

import lombok.Builder;


@Builder
public record DayOfTheWeekAnalysisResponse(
         String dayOfTheWeek,
         double averageOrder,
         double averageTransaction
) {}
