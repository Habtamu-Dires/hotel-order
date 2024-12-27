package com.hotel.scheduled_tasks;

import com.hotel.batch.data_cleaning.DataCleaningService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class TransientEventCleanupService {
    @Autowired
    private  JobLauncher jobLauncher;
    @Autowired
    private  JobExplorer jobExplorer;
    @Autowired
    @Qualifier("cleanServiceRequestJob")
    private  Job cleanServiceRequestJob;
    @Autowired
    @Qualifier("cleanCanceledOrdersJob")
    private  Job cleanCanceledOrdersJob;

    @Autowired
    private DataCleaningService dataCleaningService;

    @Value("${application.server.name}")
    private  String SERVER_NAME;


    //  delete old service requests
    @Scheduled(cron = "0 20 7 * * *")   // every day at 4 AM
    public void deleteOlderServiceRequests() {
        String jobName =dataCleaningService.getNameOfCleanServiceRequestJob();
        if(SERVER_NAME.equalsIgnoreCase("ho-api-one")){
            JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                    .addLong("startAt",System.currentTimeMillis())
                    .toJobParameters();

            try {
                jobLauncher.run(cleanServiceRequestJob, jobParameters);
                log.info("Successfully performed deleteOlderServiceRequests job");
            } catch (JobExecutionAlreadyRunningException
                     | JobRestartException
                     | JobInstanceAlreadyCompleteException
                     | JobParametersInvalidException e) {
                throw new RuntimeException("cleanServiceRequestJob Failed to start", e);
            }
        } else {
            log.info("deleteOlderServiceRequests job already done");
        }
    }

    // delete canceled orders
    @Scheduled(cron = "0 30 7 * * *")
    public void deleteCanceledOrdersAfter() {
        String jobName=dataCleaningService.getNameOfCleanCanceledOrderJob();
        if(SERVER_NAME.equalsIgnoreCase("ho-api-one")){
            JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                    .addLong("startAt", System.currentTimeMillis())
                    .toJobParameters();

            try {
                jobLauncher.run(cleanCanceledOrdersJob, jobParameters);
                log.info("successfully deleteCanceledOrdersAfter performed");
            } catch (JobExecutionAlreadyRunningException
                     | JobRestartException
                     | JobInstanceAlreadyCompleteException
                     | JobParametersInvalidException e) {
                throw new RuntimeException("cleanCanceledOrdersJob Failed to start", e);
            }
        } else {
            log.info("deleteCanceledOrdersAfter already performed");
        }
    }


}
