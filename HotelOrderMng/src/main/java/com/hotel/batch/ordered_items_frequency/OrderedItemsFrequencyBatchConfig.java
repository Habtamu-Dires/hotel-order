package com.hotel.batch.ordered_items_frequency;

import com.hotel.order.OrderRepository;
import com.hotel.order_detail.OrderDetail;
import com.hotel.order_detail.OrderDetailRepository;
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

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class OrderedItemsFrequencyBatchConfig {

    private final OrderedItemsFrequencyRepository repository;
    private final OrderRepository orderRepository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final TaskExecutor taskExecutor;

   //reader
    public RepositoryItemReader<OrderDetail> orderDetailReader(){
        RepositoryItemReader<OrderDetail> reader = new RepositoryItemReader<>();
        reader.setRepository(orderRepository);
        reader.setMethodName("getPageableCompletedOrderDetailAfter");
        reader.setArguments(List.of(LocalDateTime.now().minusDays(30)));
        reader.setPageSize(200);
        //sort
        Map<String, Sort.Direction> sort = new HashMap<>();
        sort.put("lastModifiedDate",Sort.Direction.ASC);
        reader.setSort(sort);
        return reader;
    }

    //processor
    public OrderedItemsFrequencyProcessor processor(){
       return new OrderedItemsFrequencyProcessor();
    }

//    //writer
//    public RepositoryItemWriter<OrderedItemsFrequency> frequencyWriter(){
//        RepositoryItemWriter<OrderedItemsFrequency> writer = new RepositoryItemWriter<>();
//        writer.setRepository(repository);
//        writer.setMethodName("upsertItemFrequency");
//        return writer;
//    }

    // writer
    public ItemWriter<OrderedItemsFrequency> frequencyItemWriter(OrderedItemsFrequencyRepository repository){
        return new OrderedItemFrequencyWriter(repository);
    }

    @Bean
    public Step orderedItemFrequencyUpdateStep(){
        return new StepBuilder("orderedItemFrequencyUpdateStep", jobRepository)
                .<OrderDetail,OrderedItemsFrequency>chunk(200,platformTransactionManager)
                .reader(orderDetailReader())
                .processor(processor())
                .writer(frequencyItemWriter(repository))
                .taskExecutor(taskExecutor)
                .build();
    }

    @Bean(name = "orderedItemFrequencyJob")
    public Job runOrderedItemFrequencyJob(){
        return new JobBuilder("orderedItemFrequencyJob", jobRepository)
                .start(orderedItemFrequencyUpdateStep())
                .build();
    }

}
