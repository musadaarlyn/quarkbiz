package com.codebiz.mapper.category;

import com.codebiz.dto.category.TechStackCategoryRequestDTO;
import com.codebiz.dto.category.TechStackCategoryResponseDTO;
import com.codebiz.model.TechStackCategory;

import java.util.List;
import java.util.stream.Collectors;

public class TechStackCategoryMapper {

    public static TechStackCategory toEntity(TechStackCategoryRequestDTO dto) {
        TechStackCategory entity = new TechStackCategory();
        entity.tscName = dto.tscName;
        entity.tscDescription = dto.tscDescription;
        return entity;
    }

    public static void updateEntity(TechStackCategory entity, TechStackCategoryRequestDTO dto) {
        entity.tscName = dto.tscName;
        entity.tscDescription = dto.tscDescription;
    }

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

    public static List<TechStackCategoryResponseDTO> toDTOList(List<TechStackCategory> list) {
        return list.stream().map(TechStackCategoryMapper::toDTO).collect(Collectors.toList());
    }
}
