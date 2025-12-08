package com.codebiz.service;

import com.codebiz.dto.projects.ProjectsRequestDTO;
import com.codebiz.dto.projects.ProjectsResponseDTO;
import com.codebiz.mapper.projects.ProjectsMapper;
import com.codebiz.model.Projects;

import io.quarkus.panache.common.Sort;
import io.quarkus.hibernate.orm.panache.PanacheQuery;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProjectsService {

    // CREATE
    @Transactional
    public ProjectsResponseDTO create(ProjectsRequestDTO dto) {

        Projects entity = ProjectsMapper.toEntity(dto);
        entity.createdAt = LocalDateTime.now();
        entity.updatedAt = LocalDateTime.now();

        entity.persist();
        return ProjectsMapper.toDTO(entity);
    }

    // READ ALL
    public List<ProjectsResponseDTO> getAll() {
        return Projects.<Projects>listAll()
                .stream()
                .map(ProjectsMapper::toDTO)
                .collect(Collectors.toList());
    }

    // READ BY ID
    public ProjectsResponseDTO getById(Long id) {
        Projects entity = Projects.findById(id);
        return ProjectsMapper.toDTO(entity);
    }

    // UPDATE
    @Transactional
    public ProjectsResponseDTO update(Long id, ProjectsRequestDTO dto) {
        Projects existing = Projects.findById(id);
        if (existing == null) return null;

        ProjectsMapper.updateEntity(existing, dto);
        existing.updatedAt = LocalDateTime.now();

        return ProjectsMapper.toDTO(existing);
    }

    // DELETE
    @Transactional
    public boolean delete(Long id) {
        return Projects.deleteById(id);
    }

    // SEARCH + FILTER + SORT + PAGINATION
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

        PanacheQuery<Projects> query;

        if (name != null && !name.isBlank() && status != null && !status.isBlank()) {
            query = Projects.find("projName LIKE ?1 AND status = ?2",
                    sort, "%" + name + "%", status);
        }
        else if (name != null && !name.isBlank()) {
            query = Projects.find("projName LIKE ?1", sort, "%" + name + "%");
        }
        else if (status != null && !status.isBlank()) {
            query = Projects.find("status = ?1", sort, status);
        }
        else {
            query = Projects.findAll(sort);
        }

        return query.page(page, size)
                .list()
                .stream()
                .map(ProjectsMapper::toDTO)
                .collect(Collectors.toList());
    }
}
