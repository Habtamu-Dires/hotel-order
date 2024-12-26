package com.hotel.batch.data_cleaning;

import com.hotel.service_request.ServiceRequest;
import com.hotel.service_request.ServiceRequestRepository;
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
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class CleanServiceRequestBatchConfig {

    private final ServiceRequestRepository serviceRequestRepository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;

    // reader
    public RepositoryItemReader<ServiceRequest> serviceItemReader(){
        RepositoryItemReader<ServiceRequest> reader = new RepositoryItemReader<>();
        reader.setRepository(serviceRequestRepository);
        reader.setMethodName("getOldServiceRequests");
//        reader.setArguments(List.of(LocalDateTime.now().minusHours(8)));
        reader.setArguments(List.of(LocalDateTime.now().minusMinutes(1)));
        reader.setPageSize(100);
        Map<String, Sort.Direction> sort = new HashMap<>();
        sort.put("completedDate", Sort.Direction.ASC);
        reader.setSort(sort);
        return  reader;
    }

    // processor
    public ServiceRequestProcessor serviceProcess(){
        return new ServiceRequestProcessor();
    }

    // writer
    public RepositoryItemWriter<ServiceRequest> serviceItemWriter(){
        RepositoryItemWriter<ServiceRequest> writer = new RepositoryItemWriter<>();
        writer.setRepository(serviceRequestRepository);
        writer.setMethodName("delete");
        return writer;
    }

    // step
    @Bean
    public Step deleteServicStep(){
        return  new StepBuilder("deleteServiceStep", jobRepository)
                .<ServiceRequest,ServiceRequest>chunk(100,platformTransactionManager)
                .reader(serviceItemReader())
                .processor(serviceProcess())
                .writer(serviceItemWriter())
                .taskExecutor(taskExecutor())
                .build();
    }

    @Bean(name = "cleanServiceRequestJob")
    public Job cleanServiceRequestJob(){
        return new JobBuilder("cleanServiceRequestJob", jobRepository)
                .start(deleteServicStep())
                .build();
    }

    @Bean
    public TaskExecutor taskExecutor(){
        SimpleAsyncTaskExecutor asyncTaskExecutor = new SimpleAsyncTaskExecutor();
        asyncTaskExecutor.setConcurrencyLimit(2);
        return asyncTaskExecutor;
    }
}
