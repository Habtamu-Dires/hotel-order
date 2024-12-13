package com.hotel;

import com.hotel.category.Category;
import com.hotel.category.CategoryRepository;
import com.hotel.order_detail.OrderDetailRepository;
import com.hotel.role.Role;
import com.hotel.role.RoleRepository;
import com.hotel.role.RoleType;
import com.hotel.user.User;
import com.hotel.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.UUID;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableScheduling
public class HotelOrderMngApplication {

	public static void main(String[] args) {
		SpringApplication.run(HotelOrderMngApplication.class, args);

	}

	// initialization tasks
	@Bean
	CommandLineRunner runner(RoleRepository roleRepository,
							 UserRepository userRepository,
							 PasswordEncoder passwordEncoder,
							 CategoryRepository categoryRepository){
		return args -> {
			//Create roles
			if(roleRepository.findByName(RoleType.ADMIN).isEmpty()){
				roleRepository.save(
						Role.builder()
								.name(RoleType.ADMIN)
								.build()
				);
			}
			if(roleRepository.findByName(RoleType.WAITER).isEmpty()){
				roleRepository.save(
						Role.builder()
								.name(RoleType.WAITER)
								.build()
				);
			}
			if(roleRepository.findByName(RoleType.CHEF).isEmpty()){
				roleRepository.save(
						Role.builder()
								.name(RoleType.CHEF)
								.build()
				);
			}
			if(roleRepository.findByName(RoleType.BARISTA).isEmpty()){
				roleRepository.save(
						Role.builder()
								.name(RoleType.BARISTA)
								.build()
				);
			}
			if(roleRepository.findByName(RoleType.CASHIER).isEmpty()){
				roleRepository.save(
						Role.builder()
								.name(RoleType.CASHIER)
								.build()
				);
			}
			//create one admin user
			if(userRepository.findAll().isEmpty()){
				var role = roleRepository.findByName(RoleType.ADMIN).get();
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
		};
	}

}
