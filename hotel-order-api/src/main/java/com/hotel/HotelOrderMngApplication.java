package com.hotel;

import com.hotel.category.Category;
import com.hotel.category.CategoryRepository;
import com.hotel.initialization.InitializationService;
import com.hotel.order_detail.OrderDetailRepository;
import com.hotel.role.Role;
import com.hotel.role.RoleRepository;
import com.hotel.role.RoleType;
import com.hotel.user.User;
import com.hotel.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.List;
import java.util.UUID;

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
