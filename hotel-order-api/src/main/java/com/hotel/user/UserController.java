package com.hotel.user;

import com.hotel.auth.RegistrationRequest;
import com.hotel.common.IdResponse;
import com.hotel.common.PageResponse;
import com.hotel.location.LocationResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.data.repository.config.RepositoryNameSpaceHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    //get all users
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        return ResponseEntity.ok(service.getAllUsers());
    }

    //get logged users
    @GetMapping("/logged")
    public ResponseEntity<UserResponse> getLoggedUser(
            Authentication loggedUser
    ){
        return ResponseEntity.ok(service.getLoggedUser(loggedUser));
    }

    // get page of users
    @GetMapping("/page")
    public ResponseEntity<PageResponse<UserResponse>> getPageOfUsers(
            @RequestParam(value = "page",defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size
    ){
        return ResponseEntity.ok(service.getPageOfUsers(page,size));
    }

    // get pages of users by role
    @GetMapping("/role/page")
    public ResponseEntity<PageResponse<UserResponse>> getPageOfUsersByRole(
            @RequestParam("role") String roleName,
            @RequestParam(value = "page",defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size

    ){
        return ResponseEntity.ok(service.getPageOfUsersByRole(roleName,page,size));
    }


    //get user by id
    @GetMapping("/{user-id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable("user-id") String userId
    ){
        return ResponseEntity.ok(service.getUserById(userId));
    }

    //lock / unlock user
    @PutMapping("/toggle-lock-status/{user-id}")
    public ResponseEntity<String> toggleLockStatus(
            @PathVariable("user-id") String userId
    ){
        return ResponseEntity.ok(service.toggleLockStatus(userId));
    }

    //update user profile
    @PostMapping("/update-profile/{user-id}")
    public ResponseEntity<IdResponse> updateProfile(
            @PathVariable("user-id") String userId,
            @RequestBody @Valid RegistrationRequest request
    ){
       return ResponseEntity.ok(service.updateProfile(userId,request));
    }

    // self profile update
    @PostMapping("/update-self-profile")
    public ResponseEntity<IdResponse> updateSelfProfile(
            @RequestBody @Valid SelfProfileUpdateRequest request,
            Authentication connectedUser
    ){
        return ResponseEntity.ok(service.updateSelfProfile(request, connectedUser));
    }

    // delete user
    @DeleteMapping("/{user-id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable("user-id") String userId
    ){
        service.deleteUser(userId);
        return ResponseEntity.accepted().build();
    }

    // upload profile picture
    @PostMapping(value = "/profile-picture/{user-id}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadProfilePicture(
            @PathVariable("user-id") String userId,
            @RequestPart MultipartFile file
            ){
        service.uploadProfilePicture(userId,file);
        return ResponseEntity.accepted().build();
    }

    // search user by username
    @GetMapping("/search/name/{user-name}")
    public ResponseEntity<List<UserResponse>> searchByUsername(
         @PathVariable("user-name") String username ,
         @RequestParam("role") String role
    ){
        return ResponseEntity.ok(service.searchByUsernameAndRole(username, role));
    }

}
