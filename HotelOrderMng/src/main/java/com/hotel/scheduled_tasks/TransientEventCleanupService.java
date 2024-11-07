package com.hotel.scheduled_tasks;

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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


@Service
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


    //  delete old service requests
    @Scheduled(cron = "0 0 4 * * ?")   // every day at 4 AM
    public void deleteOlderServiceRequests() {
        JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                .addLong("startAt",System.currentTimeMillis())
                .toJobParameters();

        try {
            jobLauncher.run(cleanServiceRequestJob, jobParameters);
        } catch (JobExecutionAlreadyRunningException
                | JobRestartException
                | JobInstanceAlreadyCompleteException
                | JobParametersInvalidException e) {
            throw new RuntimeException("cleanServiceRequestJob Failed to start", e);
        }

    }

    // delete canceled orders
    @Scheduled(cron = "0 0 5 * * ?")   // every day at 5AM
    public void deleteCanceledOrdersAfter() {
        JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                .addLong("startAt", System.currentTimeMillis())
                .toJobParameters();

        try {
            jobLauncher.run(cleanCanceledOrdersJob, jobParameters);
        } catch (JobExecutionAlreadyRunningException
                 | JobRestartException
                 | JobInstanceAlreadyCompleteException
                 | JobParametersInvalidException e) {
            throw new RuntimeException("cleanCanceledOrdersJob Failed to start", e);
        }
    }


}
