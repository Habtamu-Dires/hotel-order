package com.hotel.scheduled_tasks;

import com.hotel.batch.daily_average_order.DailyAverageOrderService;
import com.hotel.batch.day_of_the_week.DayOfTheWeekAnalysisService;
import com.hotel.batch.ordered_items_frequency.OrderedItemsFrequencyRepository;
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
public class BatchProcessingTasks {

    @Autowired
    private  JobLauncher jobLauncher;
    @Autowired
    private JobExplorer jobExplorer;
    @Autowired
    private OrderedItemsFrequencyRepository orderedItemsFrequencyRepository;
    @Autowired
    private DayOfTheWeekAnalysisService dayOfTheWeekAnalysisService;
    @Autowired
    private DailyAverageOrderService dailyAverageOrderService;

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


    // ordered item frequency for the last 30 days
    @Scheduled(cron = "0 0 5 * * ?")   // every day 5 AM
    public void orderedItemFrequencyJob() {
        //clear the old data
        orderedItemsFrequencyRepository.deleteAll();

        JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                .addLong("startAt", System.currentTimeMillis())
                .toJobParameters();

        try {
            jobLauncher.run(orderedItemFrequencyJob, jobParameters);
        } catch (JobExecutionAlreadyRunningException
                 | JobRestartException
                 | JobInstanceAlreadyCompleteException
                 | JobParametersInvalidException e) {
            throw new RuntimeException("orderedItemFrequencyJob Failed to start", e);
        }
    }


    // daily average for past 7 days
    @Scheduled(cron = "0 30 5 * * ?")   // every-day 5:30 AM
    public void dailyAverageOrder() {
        //clear the old data before 7 days
        dailyAverageOrderService.removeDataBefore7Days();

        JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                .addLong("startAt", System.currentTimeMillis())
                .toJobParameters();

        try {
            jobLauncher.run(dailyAverageOrderJob, jobParameters);
        } catch (JobExecutionAlreadyRunningException
                 | JobRestartException
                 | JobInstanceAlreadyCompleteException
                 | JobParametersInvalidException e) {
            throw new RuntimeException("dailyAverageOrderJob Failed to start", e);
        }
    }

    //day of the week analysis
    @Scheduled(cron = "0 0 6 * * ?")  // 6 AM
    public void DayOfTheWeekAnalysis(){
        //delete the  data before 28 day
        dayOfTheWeekAnalysisService.removeDataBefore28Days();

        JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                .addLong("startAt", System.currentTimeMillis())
                .toJobParameters();

        try {
            jobLauncher.run(dayOfTheWeekAnalysisJob, jobParameters);
        } catch (JobExecutionAlreadyRunningException
                 | JobRestartException
                 | JobInstanceAlreadyCompleteException
                 | JobParametersInvalidException e) {
            throw new RuntimeException("dayOfTheWeekAnalysisJob Failed to start", e);
        }
    }

    // aggregate monthly order data's
//    @Scheduled(cron = "0 */2 * * * *")
    @Scheduled(cron = "0 30 6 * * ?")   // every day at 6:30 AM
    public void monthlyOrderDataAggregatorJob() {
        JobParameters jobParameters = new JobParametersBuilder(jobExplorer)
                .addLong("startAt", System.currentTimeMillis())
                .toJobParameters();

        try {
            jobLauncher.run(monthlyOrderDataAggregatorJob, jobParameters);
        } catch (JobExecutionAlreadyRunningException
                 | JobRestartException
                 | JobInstanceAlreadyCompleteException
                 | JobParametersInvalidException e) {
            throw new RuntimeException("monthlyOrderDataAggregatorJob Failed to start", e);
        }
    }
}

