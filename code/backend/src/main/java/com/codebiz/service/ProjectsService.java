package com.codebiz.service;

import com.codebiz.dto.projects.ProjectsRequestDTO;
import com.codebiz.dto.projects.ProjectsResponseDTO;
import com.codebiz.mapper.projects.ProjectsMapper;
import com.codebiz.model.Projects;
import com.codebiz.model.TechStack;

import io.quarkus.panache.common.Sort;
import io.quarkus.hibernate.orm.panache.PanacheQuery;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@ApplicationScoped
public class ProjectsService {

    // -------------------------------------
    // CRUD
    // -------------------------------------
    
    //   CREATE  
    @Transactional
    public ProjectsResponseDTO create(ProjectsRequestDTO dto) {

        validateBusinessRules(dto);
        validateTechStacksExist(dto.techStackIds);
        ensureNameIsUnique(dto.projName);

        Projects entity = ProjectsMapper.toEntity(dto);
        entity.createdAt = LocalDateTime.now();
        entity.updatedAt = LocalDateTime.now();
        entity.persist();

        return ProjectsMapper.toDTO(entity);
    }

    //   READ ALL  
    public List<ProjectsResponseDTO> getAll() {
        return Projects.<Projects>listAll()
                .stream()
                .map(ProjectsMapper::toDTO)
                .toList();
    }

    //   READ BY ID  
    public ProjectsResponseDTO getById(Long id) {
        Projects entity = Projects.findById(id);
        if (entity == null)
            throw new NotFoundException("Project not found: " + id);

        return ProjectsMapper.toDTO(entity);
    }

    //   UPDATE  
    @Transactional
    public ProjectsResponseDTO update(Long id, ProjectsRequestDTO dto) {
        Projects existing = Projects.findById(id);
        if (existing == null)
            throw new NotFoundException("Project not found: " + id);

        validateBusinessRules(dto);
        validateTechStacksExist(dto.techStackIds);
        ensureNameIsUniqueForUpdate(id, dto.projName);

        ProjectsMapper.updateEntity(existing, dto);
        existing.updatedAt = LocalDateTime.now();

        return ProjectsMapper.toDTO(existing);
    }

    // DELETE
    @Transactional
    public void delete(Long id) {
        if (!Projects.deleteById(id))
            throw new NotFoundException("Project not found: " + id);
    }

    // SEARCH + SORT + FILTER + PAGINATION 
    public List<ProjectsResponseDTO> search(
            String name,
            String status,
            String sortField,
            String direction,
            int page,
            int size
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        boolean hasName = name != null && !name.isBlank();
        boolean hasStatus = status != null && !status.isBlank();

        PanacheQuery<Projects> query;

        if (hasName && hasStatus) {
            query = Projects.find(
                    "projName LIKE ?1 AND status = ?2",
                    sort,
                    "%" + name + "%",
                    status
            );
        } else if (hasName) {
            query = Projects.find("projName LIKE ?1", sort, "%" + name + "%");
        } else if (hasStatus) {
            query = Projects.find("status = ?1", sort, status);
        } else {
            query = Projects.findAll(sort);
        }

        return query.page(page, size)
                .list()
                .stream()
                .map(ProjectsMapper::toDTO)
                .toList();
    }
 
    // -------------------------------------
    // VALIDATION HELPERS 
    // -------------------------------------

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
        if (date == null || date.isBlank()) return null;

        try {
            return LocalDate.parse(date);
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Invalid date format for " + field + ". Expected yyyy-MM-dd");
        }
    }

    private void validateTechStacksExist(List<Long> ids) {
        for (Long id : ids) {
            if (TechStack.findById(id) == null)
                throw new NotFoundException("TechStack not found: " + id);
        }
    }

    private void ensureNameIsUnique(String name) {
        boolean exists = Projects.find("LOWER(projName) = LOWER(?1)", name).firstResult() != null;
        if (exists)
            throw new BadRequestException("Project name already exists");
    }

    private void ensureNameIsUniqueForUpdate(Long id, String name) {
        Projects found = Projects.find("LOWER(projName) = LOWER(?1)", name).firstResult();

        if (found != null && !found.id.equals(id))
            throw new BadRequestException("Project name already exists");
    }
}
