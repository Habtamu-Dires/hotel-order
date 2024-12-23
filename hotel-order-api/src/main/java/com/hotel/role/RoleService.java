package com.hotel.role;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository repository;

    // find roles by names
    public List<Role> findRolesByNames(List<String> names){
        return names
                .stream()
                .map(name -> repository
                        .findByName(RoleType.valueOf(name.toUpperCase()))
                            .orElseThrow(() -> new EntityNotFoundException(
                                    "Role named: "+ name + " no found"
                            ))
                )
                .toList();
    }

    // find role by name
    public Role findRoleByName(String roleName) {
        return repository.findByName(RoleType.valueOf(roleName.toUpperCase()))
                .orElseThrow(() -> new EntityNotFoundException(
                        "Role named: "+ roleName + " no found"
                ));
    }
}
