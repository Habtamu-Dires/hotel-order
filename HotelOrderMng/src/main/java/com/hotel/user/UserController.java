package com.hotel.user;

import com.hotel.auth.RegistrationRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@Tag(name = "users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    //lock / unlock user
    @PutMapping("/toggle-lock-status/{user-id}")
    public ResponseEntity<String> toggleLockStatus(
            @PathVariable("user-id") String userId
    ){
        return ResponseEntity.ok(service.toggleLockStatus(userId));
    }

    //update user profile
    @PostMapping("/update-profile/{user-id}")
    public ResponseEntity<String> updateProfile(
            @PathVariable("user-id") String userId,
            @RequestBody @Valid RegistrationRequest request
    ){
       return ResponseEntity.ok(service.updateProfile(userId,request));
    }

    // self profile update
    @PostMapping("/update-self-profile")
    public ResponseEntity<String> updateProfile(
            @RequestBody @Valid SelfProfileUpdateRequest request,
            Authentication connectedUser
    ){
        return ResponseEntity.ok(service.updateSelfProfile(request, connectedUser));
    }

    // delete user
    @DeleteMapping("/{user-id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable("user-id") String userId
    ){
        return ResponseEntity.ok(service.deleteUser(userId));
    }

}
