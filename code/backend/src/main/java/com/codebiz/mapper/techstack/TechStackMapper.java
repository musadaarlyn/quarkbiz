package com.codebiz.mapper.techstack;

import com.codebiz.dto.techstack.*;
import com.codebiz.model.TechStack;
import com.codebiz.model.TechStackCategory;

public class TechStackMapper {

    // ENTITY → DTO
    public static TechStackResponseDTO toDTO(TechStack entity) {
        if (entity == null) return null;

        TechStackResponseDTO dto = new TechStackResponseDTO();
        dto.id = entity.id;
        dto.tsName = entity.tsName;
        dto.tsDescription = entity.tsDescription;

        // category is an object → get its ID
        dto.categoryId = (entity.category != null) ? entity.category.id : null;

        dto.createdAt = entity.createdAt != null ? entity.createdAt.toString() : null;
        dto.updatedAt = entity.updatedAt != null ? entity.updatedAt.toString() : null;

        return dto;
    }

    // DTO → ENTITY (service will pass the fetched category)
    public static void updateEntity(TechStack entity, TechStackRequestDTO dto, TechStackCategory category) {

        entity.tsName = dto.tsName;
        entity.tsDescription = dto.tsDescription;
        entity.category = category; // must be an object, not an ID
    }
}
