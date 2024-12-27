package com.hotel.initialization;

import com.hotel.role.Role;
import com.hotel.role.RoleRepository;
import com.hotel.role.RoleType;
import com.hotel.user.User;
import com.hotel.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InitializationService {

   private final RoleRepository roleRepository;
   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;

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

   }

    // create role if not exists
    private void createRoleIfNotExists(RoleType roleType) {
        if (roleRepository.findByName(roleType).isEmpty()) {
            roleRepository.save(Role.builder().name(roleType).build());
        }
    }

}
