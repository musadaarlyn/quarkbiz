package com.codebiz.projects.service;

import com.codebiz.projects.dao.ProjectsDao;
import com.codebiz.projects.dao.TechStackDao;
import com.codebiz.projects.dto.projects.ProjectsRequestDTO;
import com.codebiz.projects.dto.projects.ProjectsResponseDTO;
import com.codebiz.projects.mapper.projects.ProjectsMapper;
import com.codebiz.projects.model.Projects;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@ApplicationScoped
public class ProjectsService {

    @Inject
    ProjectsDao projectsDao;

    @Inject
    TechStackDao techStackDao;

    // CREATE
    // -------------------------------------------------------------------------- >
    public ProjectsResponseDTO create(ProjectsRequestDTO dto, Long currentUserId) {

        validateBusinessRules(dto);
        validateTechStacksExist(dto.techStackIds);
        ensureNameIsUnique(dto.projName);

        Projects entity = ProjectsMapper.toEntity(dto);
        entity.userId = currentUserId;
        entity.createdAt = LocalDateTime.now();
        entity.updatedAt = LocalDateTime.now();

        projectsDao.create(entity);

        return ProjectsMapper.toDTO(entity);
    }

    // READ
    // -------------------------------------------------------------------------- >

    // FIND BY USER ID
    public List<ProjectsResponseDTO> getByUserId(Long id) {
        return projectsDao.findByUserId(id)
                .stream()
                .map(ProjectsMapper::toDTO)
                .toList();
    }

    // FIND BY PROJECT ID AND USER ID
    public ProjectsResponseDTO getById(Long id, Long userId) {
        Projects entity = projectsDao.findById(id, userId);
        if (entity == null)
            throw new NotFoundException("Project not found: " + id);

        return ProjectsMapper.toDTO(entity);
    }

    // UPDATE
    // -------------------------------------------------------------------------- >
    public ProjectsResponseDTO update(Long id, ProjectsRequestDTO dto, Long userId) {
        Projects existing = projectsDao.findById(id, userId);
        if (existing == null)
            throw new NotFoundException("Project not found: " + id);

        validateBusinessRules(dto);
        validateTechStacksExist(dto.techStackIds);
        ensureNameIsUniqueForUpdate(id, dto.projName);

        ProjectsMapper.updateEntity(existing, dto);
        existing.updatedAt = LocalDateTime.now();

        projectsDao.update(existing, userId);

        return ProjectsMapper.toDTO(existing);
    }

    // DELETE
    // -------------------------------------------------------------------------- >
    public void delete(Long id, Long userId) {
        if (!projectsDao.delete(id, userId))
            throw new NotFoundException("Project not found: " + id);
    }

    // VALIDATION HELPERS
    // -------------------------------------------------------------------------- >
    private void validateBusinessRules(ProjectsRequestDTO dto) {

        // Project name uniqueness checked separately
        if (dto.projName == null || dto.projName.isBlank())
            throw new BadRequestException("Project name is required");

        // Validate status - match database ENUM values EXACTLY
        List<String> allowedStatuses = List.of("Planning", "In Progress", "Completed", "On Hold");

        // Check if status is provided and valid
        if (dto.status == null || dto.status.isBlank()) {
            throw new BadRequestException("Status is required");
        }

        if (!allowedStatuses.contains(dto.status)) {
            throw new BadRequestException("Invalid status: " + dto.status +
                    ". Allowed values: Planning, In Progress, Completed, On Hold");
        }

        // Validate date formats
        LocalDate start = parseDate(dto.startDate, "startDate");
        LocalDate end = parseDate(dto.endDate, "endDate");

        // Validate chronological order
        if (start != null && end != null && end.isBefore(start))
            throw new BadRequestException("endDate must be after startDate");

        // Validate tech stacks
        if (dto.techStackIds == null || dto.techStackIds.isEmpty())
            throw new BadRequestException("techStackIds cannot be empty");
    }

    private LocalDate parseDate(String date, String field) {
        if (date == null || date.isBlank())
            return null;

        try {
            return LocalDate.parse(date);
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Invalid date format for " + field + ". Expected yyyy-MM-dd");
        }
    }

    private void validateTechStacksExist(List<Long> ids) {
        for (Long id : ids) {
            if (techStackDao.findById(id) == null)
                throw new NotFoundException("TechStack not found: " + id);
        }
    }

    private void ensureNameIsUnique(String name) {
        boolean exists = projectsDao.existsByNameIgnoreCase(name);
        if (exists)
            throw new BadRequestException("Project name already exists");
    }

    private void ensureNameIsUniqueForUpdate(Long id, String name) {
        boolean found = projectsDao.existsByNameIgnoreCaseExceptId(id, name);

        if (found)
            throw new BadRequestException("Project name already exists");
    }
}
