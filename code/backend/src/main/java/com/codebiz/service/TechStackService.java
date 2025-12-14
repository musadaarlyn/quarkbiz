package com.codebiz.service;

import com.codebiz.dto.techstack.TechStackRequestDTO;
import com.codebiz.mapper.techstack.TechStackMapper;
import com.codebiz.model.Projects;
import com.codebiz.model.TechStack;
import com.codebiz.model.TechStackCategory;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;


@ApplicationScoped
public class TechStackService {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    // -------------------------------------
    // CRUD
    // -------------------------------------

    // CREATE
    @Transactional
    public TechStack create(TechStackRequestDTO dto) {

        ensureNameIsUnique(dto.tsName);
        TechStackCategory category = requireCategory(dto.categoryId);

        TechStack entity = TechStackMapper.toEntity(dto, category);
        entity.createdAt = LocalDateTime.now();
        entity.updatedAt = LocalDateTime.now();

        entity.persist();
        return entity;
    }

    // READ
    public List<TechStack> listAll() {
        return TechStack.listAll();
    }

    public TechStack getById(Long id) {
        TechStack entity = TechStack.findById(id);
        if (entity == null) throw new NotFoundException("TechStack not found: " + id);
        return entity;
    }

    public List<TechStack> paginate(int page, int size) {
        return TechStack.findAll()
                .page(page, size)
                .list();
    }

    public List<TechStack> search(String name, int page, int size) {
        if (name == null || name.isBlank()) {
            return paginate(page, size);
        }

        return TechStack.find("LOWER(tsName) LIKE LOWER(?1)", "%" + name + "%")
                .page(page, size)
                .list();
    }

    // UPDATE
    @Transactional
    public TechStack update(Long id, TechStackRequestDTO dto) {

        TechStack existing = TechStack.findById(id);
        if (existing == null)
            throw new NotFoundException("TechStack not found: " + id);

        ensureNameIsUniqueForUpdate(id, dto.tsName);
        TechStackCategory category = requireCategory(dto.categoryId);

        TechStackMapper.updateEntity(existing, dto, category);
        existing.updatedAt = LocalDateTime.now();

        return existing;
    }

    // DELETE
    @Transactional
    public void delete(Long id) {
        TechStack existing = TechStack.findById(id);
        if (existing == null)
            throw new NotFoundException("TechStack not found: " + id);

        ensureNotUsedByProjects(id);

        existing.delete();
    }

    // -------------------------------------
    // VALIDATION HELPERS
    // -------------------------------------

    // ENSURE UNIQUE BEFORE CREATE
    private void ensureNameIsUnique(String name) {
        boolean exists = TechStack.find("LOWER(tsName) = LOWER(?1)", name)
                .firstResult() != null;

        if (exists)
            throw new BadRequestException("TechStack name already exists");
    }

    // ENSURE UNIQUE BEFORE UPDATE
    private void ensureNameIsUniqueForUpdate(Long id, String name) {
        TechStack found = TechStack.find("LOWER(tsName) = LOWER(?1)", name)
                .firstResult();

        if (found != null && !found.id.equals(id))
            throw new BadRequestException("TechStack name already exists");
    }

    // REQUIRE CATEGORY
    private TechStackCategory requireCategory(Long id) {
        if (id == null)
            throw new BadRequestException("categoryId is required");

        TechStackCategory category = TechStackCategory.findById(id);
        if (category == null)
            throw new NotFoundException("Category does not exist: " + id);

        return category;
    }

    // ENSURE NO PROJECTS BEFORE DELETE
    private void ensureNotUsedByProjects(Long techStackId) {
        for (Projects project : Projects.<Projects>listAll()) {
            if (readTechStackIds(project.techStackIds).contains(techStackId)) {
                throw new BadRequestException(
                    "Cannot delete tech stack while it is used by project: " + project.projName);
            }
        }
    }

    private List<Long> readTechStackIds(String json) {
        try {
            if (json == null || json.isBlank()) return List.of();
            return objectMapper.readValue(json, new TypeReference<List<Long>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }
}
