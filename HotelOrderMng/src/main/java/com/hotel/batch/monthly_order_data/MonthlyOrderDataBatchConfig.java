package com.hotel.batch.monthly_order_data;

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
import org.springframework.batch.item.data.RepositoryItemWriter;
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
public class MonthlyOrderDataBatchConfig {

    private final MonthlyOrderDataRepository repository;
    private final OrderRepository orderRepository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final TaskExecutor taskExecutor;
    private final LocalDateTime todayMidnight = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);


    // item reader
    public RepositoryItemReader<ItemOrder> orderReader(){
        RepositoryItemReader<ItemOrder> reader = new RepositoryItemReader<>();
        reader.setRepository(orderRepository);
        reader.setMethodName("getPageableCompletedOrdersAfter");
        reader.setArguments(List.of(todayMidnight.minusDays(1)));
        reader.setPageSize(200);
        // sort
        Map<String, Sort.Direction> sort = new HashMap<>();
        sort.put("lastModifiedDate", Sort.Direction.ASC);
        reader.setSort(sort);
        return  reader;
    }

    // process
    public MonthlyOrderDataProcessor processor(){
        return new MonthlyOrderDataProcessor();
    }

    public ItemWriter<MonthlyOrderData> monthlItemWriter(MonthlyOrderDataRepository repository){
        return new MonthlyOrderDataWriter(repository);
    }

    //step
    @Bean
    public Step monthlyDataUpdateStep(){
        return new StepBuilder("monthlyDataUpdateStep", jobRepository)
                .<ItemOrder,MonthlyOrderData>chunk(200, platformTransactionManager)
                .reader(orderReader())
                .processor(processor())
                .writer(monthlItemWriter(repository))
                .taskExecutor(taskExecutor)
                .build();
    }

    //job
    @Bean(name = "monthlyOrderDataAggregatorJob")
    public Job runMonthlyOrderDataAggregatorJob(){
        return new JobBuilder("monthlyOrderDataAggregatorJob", jobRepository)
                .start(monthlyDataUpdateStep())
                .build();
    }

}
