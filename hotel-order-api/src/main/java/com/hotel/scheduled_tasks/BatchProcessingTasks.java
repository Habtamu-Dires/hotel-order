package com.hotel.scheduled_tasks;

import com.hotel.batch.daily_average_order.DailyAverageOrderService;
import com.hotel.batch.day_of_the_week.DayOfTheWeekAnalysisService;
import com.hotel.batch.monthly_order_data.MonthlyOrderDataService;
import com.hotel.batch.ordered_items_frequency.OrderedItemFrequencyService;
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
public class BatchProcessingTasks {

    @Autowired
    private  JobLauncher jobLauncher;
    @Autowired
    private JobExplorer jobExplorer;

    @Autowired
    private DayOfTheWeekAnalysisService dayOfTheWeekAnalysisService;
    @Autowired
    private DailyAverageOrderService dailyAverageOrderService;
    @Autowired
    private OrderedItemFrequencyService orderedItemFrequencyService;
    @Autowired
    private MonthlyOrderDataService monthlyOrderDataService;

    @Autowired
    @Qualifier("monthlyOrderDataAggregatorJob")
    private  Job monthlyOrderDataAggregatorJob;
    @Autowired
    @Qualifier("orderedItemFrequencyJob")
    private Job orderedItemFrequencyJob;
    @Autowired
    @Qualifier("dayOfTheWeekAnalysisJob")
    private Job dayOfTheWeekAnalysisJob;
    @Autowired
    @Qualifier("dailyAverageOrderJob")
    private Job dailyAverageOrderJob;


    @Value("${application.server.name}")
    private  String SERVER_NAME;

    // ordered item frequency for the last 30 days
    @Scheduled(cron = "0 0 5 * * *")   // every day 5 AM
    public void orderedItemFrequencyJob() {
        log.info("Starting orderedItemFrequencyJob");
        if(SERVER_NAME.equalsIgnoreCase("ho-api-one")){
            //clear the old data
            orderedItemFrequencyService.deleteAll();

            JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                    .addLong("startAt", System.currentTimeMillis())
                    .toJobParameters();

            try {
                jobLauncher.run(orderedItemFrequencyJob, jobParameters);
                log.info("Successfully performed orderedItemFrequencyJob");
            } catch (JobExecutionAlreadyRunningException
                     | JobRestartException
                     | JobInstanceAlreadyCompleteException
                     | JobParametersInvalidException e) {
                throw new RuntimeException("orderedItemFrequencyJob Failed to start", e);
            }
        } else {
            log.info("orderedItemFrequencyJob already performed");
        }
    }

    // daily average for past 7 days
    @Scheduled(cron = "0 30 5 * * ?")   // every-day 5:30 AM
    public void dailyAverageOrder() {
        log.info("Starting dailyAverageOrder scheduled task");
        if(SERVER_NAME.equalsIgnoreCase("ho-api-one")){
            //clear the old data before 7 days
            dailyAverageOrderService.removeDataBefore7Days();

            JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                    .addLong("startAt", System.currentTimeMillis())
                    .toJobParameters();

            try {
                jobLauncher.run(dailyAverageOrderJob, jobParameters);
                log.info("Successfully perform dailyAverageOrderJob");
            } catch (JobExecutionAlreadyRunningException
                     | JobRestartException
                     | JobInstanceAlreadyCompleteException
                     | JobParametersInvalidException e) {
                throw new RuntimeException("dailyAverageOrderJob Failed to start", e);
            }
        } else {
            log.info("dailyAverageOrderJob already Performed");
        }
    }

    //day of the week analysis
    @Scheduled(cron = "0 0 6 * * *")  // 6 AM
    public void dayOfTheWeekAnalysis(){
        if(SERVER_NAME.equalsIgnoreCase("ho-api-one")){
            //delete the  data before 28 day
            dayOfTheWeekAnalysisService.removeDataBefore28Days();

            JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                    .addLong("startAt", System.currentTimeMillis())
                    .toJobParameters();

            try {
                jobLauncher.run(dayOfTheWeekAnalysisJob, jobParameters);
                log.info("Successfully perform day of the week analysis");
            } catch (JobExecutionAlreadyRunningException
                     | JobRestartException
                     | JobInstanceAlreadyCompleteException
                     | JobParametersInvalidException e) {
                throw new RuntimeException("dayOfTheWeekAnalysisJob Failed to start", e);
            }
        } else {
            log.info("dayOfTheWeekAnalysis job already performed");
        }
    }

    // aggregate monthly order data's
    @Scheduled(cron = "0 30 6 * * ?")   // every day at 6:30 AM
    public void monthlyOrderDataAggregatorJob() {
        if(SERVER_NAME.equalsIgnoreCase("ho-api-one")){
            JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                    .addLong("startAt", System.currentTimeMillis())
                    .toJobParameters();

            try {
                jobLauncher.run(monthlyOrderDataAggregatorJob, jobParameters);
                log.info("Successfully performed monthlyOrderDataAggregatorJob");
            } catch (JobExecutionAlreadyRunningException
                     | JobRestartException
                     | JobInstanceAlreadyCompleteException
                     | JobParametersInvalidException e) {
                throw new RuntimeException("monthlyOrderDataAggregatorJob Failed to start", e);
            }
        } else{
            log.info("monthlyOrderDataAggregatorJob already performed");
        }
    }
}

