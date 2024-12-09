package com.hotel.batch.day_of_the_week;

import com.hotel.order.ItemOrder;
import com.hotel.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.data.RepositoryItemReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class DayOfTheWeekAnalysisBatchConfig {

    private final DayOfTheWeekAnalysisRepository repository;
    private final OrderRepository orderRepository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final TaskExecutor taskExecutor;
    private final LocalDateTime todayMidnight = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
    private final LocalDateTime yesterdayMidnight = LocalDateTime.of(LocalDate.now().minusDays(1), LocalTime.MIDNIGHT);

    //reader
    public RepositoryItemReader<ItemOrder> orderReader(){
        RepositoryItemReader<ItemOrder> reader = new RepositoryItemReader<>();
        reader.setRepository(orderRepository);
        reader.setMethodName("getPageableCompletedOrdersAfterBefore");
        reader.setArguments(List.of(yesterdayMidnight,todayMidnight));
        reader.setPageSize(200);
        // sort
        Map<String, Sort.Direction> sort = new HashMap<>();
        sort.put("lastModifiedDate", Sort.Direction.ASC);
        reader.setSort(sort);
        return reader;
    }

    //processor
    public DayOfTheWeekAnalysisProcessor processor(){
        return new DayOfTheWeekAnalysisProcessor();
    }

//    //writer
//    public RepositoryItemWriter<DayOfTheWeekAnalysis> dayOfTheWeekWriter(){
//        RepositoryItemWriter<DayOfTheWeekAnalysis> writer = new RepositoryItemWriter<>();
//        writer.setRepository(repository);
//        writer.setMethodName("upsertDayOfTheWeekData");
//        return writer;
//    }
    // writer
    public ItemWriter<DayOfTheWeekAnalysis> dayOfTheWeekWriter(DayOfTheWeekAnalysisRepository repository){
        return new DayOfTheWeekAnalysisWriter(repository);
    }

    // step
    @Bean
    public Step dayOfTheWeekAnalysisStep(){
        return new StepBuilder("dayOfTheWeekAnalysisStep", jobRepository)
                .<ItemOrder,DayOfTheWeekAnalysis>chunk(200,platformTransactionManager)
                .reader(orderReader())
                .processor(processor())
                .writer(dayOfTheWeekWriter(repository))
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
