package com.codebiz.mapper.category;

import com.codebiz.dto.category.*;
import com.codebiz.model.TechStackCategory;

public class TechStackCategoryMapper {

    public static TechStackCategoryResponseDTO toDTO(TechStackCategory entity) {
        if (entity == null) return null;

        TechStackCategoryResponseDTO dto = new TechStackCategoryResponseDTO();
        dto.id = entity.id;
        dto.tscName = entity.tscName;
        dto.tscDescription = entity.tscDescription;
        dto.createdAt = entity.createdAt != null ? entity.createdAt.toString() : null;
        dto.updatedAt = entity.updatedAt != null ? entity.updatedAt.toString() : null;

        return dto;
    }

    public static void updateEntity(TechStackCategory entity, TechStackCategoryRequestDTO dto) {
        entity.tscName = dto.tscName;
        entity.tscDescription = dto.tscDescription;
    }
}

