package com.hotel.batch.daily_average_order;

import com.hotel.order.ItemOrder;
import com.hotel.order.OrderRepository;
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
public class DailyAverageOrderBatchConfig {

    private final OrderRepository orderRepository;
    private final DailyAverageOrderRepository repository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final TaskExecutor taskExecutor;
    private final LocalDateTime todayMidnight = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
    private final LocalDateTime yesterdayMidnight = todayMidnight.minusDays(1);


    //reader
    public RepositoryItemReader<ItemOrder> dailyOrderReader(){
        RepositoryItemReader<ItemOrder> reader = new RepositoryItemReader<>();
        reader.setRepository(orderRepository);
        reader.setMethodName("getPageableCompletedOrdersAfterBefore");
        reader.setArguments(List.of(yesterdayMidnight,todayMidnight));
        reader.setPageSize(100);
        return reader;
    }

    //processor
    public DailyAverageOrderProcessor processor(){
        return new DailyAverageOrderProcessor();
    }

    //writer
    public RepositoryItemWriter<DailyAverageOrder> dailyOrderWriter(){
        RepositoryItemWriter<DailyAverageOrder> writer = new RepositoryItemWriter<>();
        writer.setRepository(repository);
        writer.setMethodName("upsertDailyAverageOrder");
        return writer;
    }

    // set
    @Bean
    public Step dailyAverageOrderStep(){
        return new StepBuilder("dailyAverageOrderStep", jobRepository)
                .<ItemOrder,DailyAverageOrder>chunk(100, platformTransactionManager)
                .reader(dailyOrderReader())
                .processor(processor())
                .writer(dailyOrderWriter())
                .taskExecutor(taskExecutor)
                .build();
    }
    // job
    @Bean(name = "dailyAverageOrderJob")
    public Job dailyAverageOrderJob(){
        return new JobBuilder("dailyAverageOrderJob", jobRepository)
                .start(dailyAverageOrderStep())
                .build();
    }
}
