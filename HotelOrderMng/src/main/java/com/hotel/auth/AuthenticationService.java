package com.hotel.auth;

import com.hotel.common.IdResponse;
import com.hotel.role.Role;
import com.hotel.role.RoleService;
import com.hotel.security.JwtService;
import com.hotel.user.User;
import com.hotel.user.UserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public IdResponse register(@Valid RegistrationRequest request) {

        List<Role> roles = roleService.findRolesByNames(request.roles());
        // check username
        var savedUser = userRepository.findByUsername(request.username());
        if(savedUser.isPresent()){
            throw new EntityExistsException("Username" + request.username() + " is already in used");
        }

        User user = User.builder()
                .id(UUID.randomUUID())
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phoneNumber(request.phoneNumber())
                .email(request.email())
                .roles(new ArrayList<>(roles))
                .build();


        String id = userRepository.save(user).getId().toString();
        return  new IdResponse(id);

    }

    public AuthenticationResponse authenticate(@Valid AuthenticationRequest request) {
            var auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.username(),
                            request.password()
                    )
            );

            var claims = new HashMap<String, Object>();
            User user = ((User)auth.getPrincipal());
            claims.put("fullName", user.fullName());

            var token = jwtService.generateToken(claims, user);

            return new AuthenticationResponse(token);
    }
}
