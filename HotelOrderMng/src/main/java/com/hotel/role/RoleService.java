package com.hotel.role;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository repository;

    public List<Role> findRolesByNames(List<RoleType> names){
        return names
                .stream()
                .map(name -> repository.findByName(name)
                            .orElseThrow(() -> new EntityNotFoundException(
                                    "Role named: "+ name + " no found"
                            ))
                )
                .toList();
    }
}
