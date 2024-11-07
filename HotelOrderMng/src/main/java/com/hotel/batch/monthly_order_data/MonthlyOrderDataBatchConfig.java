package com.hotel.batch.monthly_order_data;

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

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class MonthlyOrderDataBatchConfig {

    private final MonthlyOrderDataRepository repository;
    private final ItemOrderRepository itemOrderRepository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final TaskExecutor taskExecutor;

    // item reader
    public RepositoryItemReader<ItemOrder> orderReader(){
        RepositoryItemReader<ItemOrder> reader = new RepositoryItemReader<>();
        reader.setRepository(itemOrderRepository);
        reader.setMethodName("getPageableCompletedOrdersAfter");
        reader.setArguments(List.of(LocalDateTime.now().minusDays(1)));
        reader.setPageSize(200);
        return  reader;
    }

    // process
    public MonthlyOrderDataProcessor processor(){
        return new MonthlyOrderDataProcessor();
    }

    //writer
    public RepositoryItemWriter<MonthlyOrderData> orderWriter(){
        RepositoryItemWriter<MonthlyOrderData> writer = new RepositoryItemWriter<>();
        writer.setRepository(repository);
        writer.setMethodName("upsertMonthlyData");
        return writer;
    }

    //step
    @Bean
    public Step monthlyDataUpdateStep(){
        return new StepBuilder("monthlyDataUpdateStep", jobRepository)
                .<ItemOrder,MonthlyOrderData>chunk(200, platformTransactionManager)
                .reader(orderReader())
                .processor(processor())
                .writer(orderWriter())
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
