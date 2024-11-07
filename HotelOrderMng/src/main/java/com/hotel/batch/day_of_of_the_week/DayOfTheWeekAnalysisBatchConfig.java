package com.hotel.batch.day_of_of_the_week;

import com.hotel.order.ItemOrder;
import com.hotel.order.ItemOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.data.RepositoryItemReader;
import org.springframework.batch.item.data.RepositoryItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DayOfTheWeekAnalysisBatchConfig {

    private final DayOfTheWeekAnalysisRepository repository;
    private final ItemOrderRepository itemOrderRepository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final TaskExecutor taskExecutor;
    private final LocalDateTime todayMidnight = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
    private final LocalDateTime yesterdayMidnight = LocalDateTime.of(LocalDate.now().minusDays(1), LocalTime.MIDNIGHT);

    //reader
    public RepositoryItemReader<ItemOrder> orderReader(){
        RepositoryItemReader<ItemOrder> reader = new RepositoryItemReader<>();
        reader.setRepository(itemOrderRepository);
        reader.setMethodName("getPageableCompletedOrdersAfterBefore");
        reader.setArguments(List.of(yesterdayMidnight,todayMidnight));
        reader.setPageSize(200);
        return reader;
    }

    //processor
    public DayOfTheWeekAnalysisProcessor processor(){
        return new DayOfTheWeekAnalysisProcessor();
    }
    //writer
    public RepositoryItemWriter<DayOfTheWeekAnalysis> dayOfTheWeekWriter(){
        RepositoryItemWriter<DayOfTheWeekAnalysis> writer = new RepositoryItemWriter<>();
        writer.setRepository(repository);
        writer.setMethodName("upsertDayOfTheWeekData");
        return writer;
    }

    // step
    @Bean
    public Step dayOfTheWeekAnalysisStep(){
        return new StepBuilder("dayOfTheWeekAnalysisStep", jobRepository)
                .<ItemOrder,DayOfTheWeekAnalysis>chunk(200,platformTransactionManager)
                .reader(orderReader())
                .processor(processor())
                .writer(dayOfTheWeekWriter())
                .taskExecutor(taskExecutor)
                .build();
    }

    // job
    @Bean(name = "dayOfTheWeekAnalysisJob")
    public Job dayOfTheWeekAnalysisJob(){
        return new JobBuilder("dayOfTheWeekAnalysisJob", jobRepository)
                .start(dayOfTheWeekAnalysisStep())
                .build();
    }
}
