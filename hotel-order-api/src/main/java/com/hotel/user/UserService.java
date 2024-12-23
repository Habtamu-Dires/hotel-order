package com.hotel.user;

import com.hotel.auth.RegistrationRequest;
import com.hotel.common.IdResponse;
import com.hotel.common.PageResponse;
import com.hotel.file.FileStorageService;
import com.hotel.role.Role;
import com.hotel.role.RoleService;
import com.hotel.role.RoleType;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final RoleService roleService;
    private final UserMapper mapper;
    private final FileStorageService fileStorageService;


    // get all users
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<UserResponse> getAllUsers() {
        return repository.findAll()
                .stream()
                .map(mapper::toUserResponse)
                .toList();
    }

    // get logged user
    public UserResponse getLoggedUser(Authentication loggedUser) {
        User user = ((User) loggedUser.getPrincipal());
        return  mapper.toUserResponse(user);
    }

    //get page of users
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PageResponse<UserResponse> getPageOfUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<User> res = repository.findAll(pageable);

        List<UserResponse> userResponseList = res
                .map(mapper::toUserResponse)
                .toList();

        return PageResponse.<UserResponse>builder()
                .content(userResponseList)
                .totalElements(res.getTotalElements())
                .numberOfElements(res.getNumberOfElements())
                .totalPages(res.getTotalPages())
                .size(res.getSize())
                .number(res.getNumber())
                .first(res.isFirst())
                .last(res.isLast())
                .empty(res.isEmpty())
                .build();
    }

    // get user by id
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public UserResponse getUserById(String userId) {
        return mapper.toUserResponse(this.findUserById(userId));
    }

    // get page of users by role
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PageResponse<UserResponse> getPageOfUsersByRole(String roleName, int page, int size){
        RoleType roleType = null;
        try {
            roleType = roleService.findRoleByName(roleName).getName();;
        }catch (Exception ignored){}

        Specification<User> spec = UserSpecification.findByRole(roleType);
        Pageable pageable = PageRequest.of(page,size);

        Page<User> res = repository.findAll(spec, pageable);

        List<UserResponse> userResponseList = res.map(mapper::toUserResponse)
                .toList();
        return PageResponse.<UserResponse>builder()
                .content(userResponseList)
                .totalElements(res.getTotalElements())
                .numberOfElements(res.getNumberOfElements())
                .totalPages(res.getTotalPages())
                .size(res.getSize())
                .number(res.getNumber())
                .first(res.isFirst())
                .last(res.isLast())
                .empty(res.isEmpty())
                .build();
    }


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
    @Transactional
    public IdResponse updateProfile(String userId, @Valid RegistrationRequest request) {
        List<Role> roles = roleService.findRolesByNames(request.roles());
        User savedUser = this.findUserById(userId);

        savedUser.setFirstName(request.firstName());
        savedUser.setLastName(request.lastName());
        savedUser.setEmail(request.email());
        savedUser.setPhoneNumber(request.phoneNumber());
        savedUser.setRoles(new ArrayList<>(roles));

        // new password ?
        if(!savedUser.getPassword().equals(request.password())){
           savedUser.setPassword(request.password());  // new password
        }
        // new username ?
        if(!savedUser.getUsername().equals(request.username())){
            Optional<User> exitedUser = repository.findByUsername(request.username());
            if(exitedUser.isPresent()){
                throw new EntityExistsException("Username" + request.username() + " is already in used");
            }
            savedUser.setUsername(request.username());
        }
        repository.save(savedUser);
        return new IdResponse(userId);
    }

    //delete user
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteUser(String userId) {
        User user = this.findUserById(userId);
        repository.delete(user);
    }

    // update self profile
    public IdResponse updateSelfProfile(
            @Valid SelfProfileUpdateRequest request,
            Authentication connectedUser)
    {
        User user = ((User)connectedUser.getPrincipal());
        if(!user.getUsername().equals(request.username())){
            user.setUsername(request.username());
        }
        if(!user.getPassword().equals(request.password())){
            user.setPassword(request.password());
        }
        repository.save(user);
        return new IdResponse(user.getId().toString());
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void uploadProfilePicture(String userId, MultipartFile file) {
        User user = this.findUserById(userId);
        if(user.getImageUrl() != null && !user.getImageUrl().isBlank()){
            fileStorageService.deleteImage(user.getImageUrl());
        }
        String imageUrl = fileStorageService.saveFile(file, userId, "users");

        user.setImageUrl(imageUrl);
        repository.save(user);
    }

    //search
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<UserResponse> searchByUsernameAndRole(String username, String roleName) {
       RoleType roleType = null;
        try{
            roleType = roleService.findRoleByName(roleName).getName();
        } catch (Exception ignored){}

        Specification<User> spec = UserSpecification
                .searchUser(username,roleType);

        return repository.findAll(spec)
                .stream()
                .map(mapper::toUserResponse)
                .toList();
    }


}
