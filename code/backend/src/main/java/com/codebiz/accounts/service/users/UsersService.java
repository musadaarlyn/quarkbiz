package com.codebiz.accounts.service.users;

import java.time.LocalDateTime;

import com.codebiz.accounts.dao.UsersDao;
import com.codebiz.accounts.dto.users.UsersRequestDTO;
import com.codebiz.accounts.dto.users.UsersResponseDTO;
import com.codebiz.accounts.model.users.User;

import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;

@ApplicationScoped
public class UsersService {

    @Inject
    UsersDao usersDao;

    // CREATE
    // -------------------------------------------------------------------------- >
    public UsersResponseDTO create(UsersRequestDTO dto) {

        // Business validation
        if (usersDao.existsByUsername(dto.username)) {
            throw new BadRequestException("Username already exists");
        }

        // Hash password
        String passwordHash = BcryptUtil.bcryptHash(dto.password);

        // Build entity
        User user = new User();
        user.username = dto.username;
        user.password_hash = passwordHash;
        user.displayName = dto.displayName;
        user.createdAt = LocalDateTime.now();
        user.updatedAt = null;

        // 4Persist
        usersDao.create(user);

        // Map to response DTO
        return toResponseDTO(user);
    }

    // MAPPER
    // -------------------------------------------------------------------------- >
    private UsersResponseDTO toResponseDTO(User user) {
        UsersResponseDTO dto = new UsersResponseDTO();
        dto.id = user.id;
        dto.username = user.username;
        dto.displayName = user.displayName;
        dto.createdAt = user.createdAt;
        return dto;
    }
}
