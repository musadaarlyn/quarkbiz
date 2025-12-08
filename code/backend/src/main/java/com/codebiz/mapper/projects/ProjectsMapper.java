package com.codebiz.mapper.projects;

import com.codebiz.dto.projects.ProjectsRequestDTO;
import com.codebiz.dto.projects.ProjectsResponseDTO;
import com.codebiz.model.Projects;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.List;

public class ProjectsMapper {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    // JSON → List<Long>
    private static List<Long> jsonToList(String json) {
        try {
            if (json == null || json.isBlank()) return List.of();
            return objectMapper.readValue(json, new TypeReference<List<Long>>() {});
        } catch (Exception e) {
            return List.of(); // fallback
        }
    }

    // List<Long> → JSON
    private static String listToJson(List<Long> list) {
        try {
            if (list == null) return "[]"; 
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]"; // fallback
        }
    }

    // ENTITY → DTO
    public static ProjectsResponseDTO toDTO(Projects entity) {
        if (entity == null) return null;

        ProjectsResponseDTO dto = new ProjectsResponseDTO();

        dto.id = entity.id;
        dto.projName = entity.projName;
        dto.projDescription = entity.projDescription;

        dto.techStackIds = jsonToList(entity.techStackIds);

        dto.status = entity.status;

        dto.startDate = entity.startDate != null ? entity.startDate.toString() : null;
        dto.endDate = entity.endDate != null ? entity.endDate.toString() : null;

        dto.createdAt = entity.createdAt != null ? entity.createdAt.toString() : null;
        dto.updatedAt = entity.updatedAt != null ? entity.updatedAt.toString() : null;

        return dto;
    }

    // DTO → ENTITY (CREATE)
    public static Projects toEntity(ProjectsRequestDTO dto) {
        Projects entity = new Projects();

        entity.projName = dto.projName;
        entity.projDescription = dto.projDescription;

        entity.techStackIds = listToJson(dto.techStackIds); 

        entity.status = dto.status;

        entity.startDate = dto.startDate != null ? LocalDate.parse(dto.startDate) : null;
        entity.endDate = dto.endDate != null ? LocalDate.parse(dto.endDate) : null;

        return entity;
    }

    // DTO → EXISTING ENTITY (UPDATE)
    public static void updateEntity(Projects entity, ProjectsRequestDTO dto) {
        entity.projName = dto.projName;
        entity.projDescription = dto.projDescription;

        entity.techStackIds = listToJson(dto.techStackIds);

        entity.status = dto.status;

        entity.startDate = dto.startDate != null ? LocalDate.parse(dto.startDate) : null;
        entity.endDate = dto.endDate != null ? LocalDate.parse(dto.endDate) : null;
    }
}
