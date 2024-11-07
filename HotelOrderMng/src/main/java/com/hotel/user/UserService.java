package com.hotel.user;

import com.hotel.auth.RegistrationRequest;
import com.hotel.role.Role;
import com.hotel.role.RoleService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    // toggle user lock status
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String toggleLockStatus(String userId) {
        User user = this.findUserById(userId);
        user.setAccountLocked(!user.isAccountLocked());

        return  repository.save(user).getId().toString();
    }

    //find user by id
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public User findUserById(String userId){
        return  repository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }


    // update user profile
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String updateProfile(String userId, @Valid RegistrationRequest request) {
        List<Role> roles = roleService.findRolesByNames(request.roles());
        User user = User.builder()
                .id(UUID.fromString(userId))
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phoneNumber(request.phoneNumber())
                .email(request.email())
                .roles(roles)
                .build();

        return repository.save(user).getId().toString();
    }

    //delete user
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String deleteUser(String userId) {
        User user = this.findUserById(userId);
        repository.delete(user);

        return user.getId().toString();
    }

    // update self profile
    public String updateSelfProfile(
            @Valid SelfProfileUpdateRequest request,
            Authentication connectedUser)
    {
        User user = ((User)connectedUser.getPrincipal());
        user.setUsername(request.username());
        user.setPassword(request.password());

        return  repository.save(user).getId().toString();
    }
}
