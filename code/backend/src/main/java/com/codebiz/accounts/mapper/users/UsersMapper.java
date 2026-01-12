package com.codebiz.accounts.mapper.users;

import com.codebiz.accounts.dto.users.UsersRequestDTO;
import com.codebiz.accounts.dto.users.UsersResponseDTO;
import com.codebiz.accounts.model.users.User;

public class UsersMapper {

    // ENTITY -> DTO
    public static UsersResponseDTO toDTO(User entity) {
        if (entity == null)
            return null;

        UsersResponseDTO dto = new UsersResponseDTO();
        dto.id = entity.id;
        dto.username = entity.username;
        dto.displayName = entity.displayName;
        dto.createdAt = entity.createdAt;

        return dto;
    }

    // DTO -> ENTITY (CREATE)
    public static User toEntity(UsersRequestDTO dto) {

        User entity = new User();
        entity.username = dto.username;
        entity.password_hash = dto.password;
        entity.displayName = dto.displayName;

        return entity;
    }
}
