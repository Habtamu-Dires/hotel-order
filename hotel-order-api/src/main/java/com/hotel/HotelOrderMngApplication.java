package com.hotel;

import com.hotel.initialization.InitializationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableScheduling
@EnableConfigurationProperties
@EnableTransactionManagement
public class HotelOrderMngApplication {

	public static void main(String[] args) {
		SpringApplication.run(HotelOrderMngApplication.class, args);
	}

	// run initialization service
	@Bean
	CommandLineRunner runner(InitializationService service){
		return args -> {
			service.initializeData();
		};
	}


}
