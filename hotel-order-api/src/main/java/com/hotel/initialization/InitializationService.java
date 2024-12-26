package com.hotel.initialization;

import com.hotel.batch.batch_status.BatchStatus;
import com.hotel.batch.batch_status.BatchStatusRepository;
import com.hotel.batch.daily_average_order.DailyAverageOrderService;
import com.hotel.batch.data_cleaning.DataCleaningService;
import com.hotel.batch.day_of_the_week.DayOfTheWeekAnalysisService;
import com.hotel.batch.monthly_order_data.MonthlyOrderDataService;
import com.hotel.batch.ordered_items_frequency.OrderedItemFrequencyService;
import com.hotel.role.Role;
import com.hotel.role.RoleRepository;
import com.hotel.role.RoleType;
import com.hotel.user.User;
import com.hotel.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InitializationService {

   private final RoleRepository roleRepository;
   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;
   private final BatchStatusRepository batchStatusRepository;

   private final DailyAverageOrderService dailyAverageOrderService;
   private final DayOfTheWeekAnalysisService dayOfTheWeekAnalysisService;
   private final MonthlyOrderDataService monthlyOrderDataService;
   private final OrderedItemFrequencyService orderedItemFrequencyService;
   private final DataCleaningService dataCleaningService;

   @Transactional
   public void initializeData(){

       // locke role table
       roleRepository.lockRoleTable();

       // lock user table using database lock
       userRepository.lockUsersTable();

       // Create roles if not present
       createRoleIfNotExists(RoleType.ADMIN);
       createRoleIfNotExists(RoleType.WAITER);
       createRoleIfNotExists(RoleType.CHEF);
       createRoleIfNotExists(RoleType.BARISTA);
       createRoleIfNotExists(RoleType.CASHIER);

       // Create admin user if none exists
       if (userRepository.findAll().isEmpty()) {
           var role = roleRepository.findByName(RoleType.ADMIN)
                   .orElseThrow(() -> new IllegalStateException("Admin role not found"));

           userRepository.save(
                   User.builder()
                           .id(UUID.randomUUID())
                           .username("hab")
                           .firstName("hab")
                           .lastName("ad")
                           .password(passwordEncoder.encode("password"))
                           .roles(List.of(role))
                           .email("example.com")
                           .phoneNumber("0907111111")
                           .build()
           );
       }

       // register batch jobs
       registerBatchJob(dailyAverageOrderService.getName());
       registerBatchJob(dayOfTheWeekAnalysisService.getName());
       registerBatchJob(monthlyOrderDataService.getName());
       registerBatchJob(orderedItemFrequencyService.getName());
       registerBatchJob(dataCleaningService.getNameOfCleanServiceRequestJob());
       registerBatchJob(dataCleaningService.getNameOfCleanCanceledOrderJob());
       registerBatchJob("updatePopularItem");

   }

    // create role if not exists
    private void createRoleIfNotExists(RoleType roleType) {
        if (roleRepository.findByName(roleType).isEmpty()) {
            roleRepository.save(Role.builder().name(roleType).build());
        }
    }

    // register batch job to batch status
    private void registerBatchJob(String batchName){
        if(batchStatusRepository.findById(batchName).isEmpty()){
            batchStatusRepository.save(
                    BatchStatus.builder()
                            .name(batchName)
                            .lastRunDate(LocalDate.now().minusDays(1))
                            .build()
            );
        }
    }

}
