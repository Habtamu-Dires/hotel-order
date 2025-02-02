package com.hotel.batch.data_cleaning;

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
import org.springframework.data.domain.Sort;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class CleanCanceledOrdersBatchConfig {

    private final OrderRepository orderRepository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final TaskExecutor taskExecutor;

    // item reader
    public RepositoryItemReader<ItemOrder> orderItemReader(){
        RepositoryItemReader<ItemOrder> reader = new RepositoryItemReader<>();
        reader.setRepository(orderRepository);
        reader.setMethodName("getCanceledOrders");
        reader.setPageSize(100);
        Map<String, Sort.Direction> sort = new HashMap<>();
        sort.put("lastModifiedDate", Sort.Direction.ASC);
        reader.setSort(sort);
        return reader;
    }

    // process
    public ItemOrderProcessor emptyProcess(){
        return new ItemOrderProcessor();
    }

    // writer
    public RepositoryItemWriter<ItemOrder> orderItemWriter(){
        RepositoryItemWriter<ItemOrder> writer = new RepositoryItemWriter<>();
        writer.setRepository(orderRepository);
        writer.setMethodName("delete");
        return writer;
    }

    // step
    @Bean
    public Step deleteOrderStep(){
        return new StepBuilder("deleteOrderStep", jobRepository)
                .<ItemOrder,ItemOrder>chunk(100, platformTransactionManager)
                .reader(orderItemReader())
                .processor(emptyProcess())
                .writer(orderItemWriter())
                .taskExecutor(taskExecutor)
                .build();
    }

    // job
    @Bean(name = "cleanCanceledOrdersJob")
    public Job runCleaningOrdersJob(){
        return new JobBuilder("cleanCanceledOrdersJob", jobRepository)
                .start(deleteOrderStep())
                .build();
    }

}
