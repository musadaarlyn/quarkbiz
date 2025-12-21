package com.codebiz.service;

import com.codebiz.dao.TechStackDao;
import com.codebiz.dao.TechStackCategoryDao;
import com.codebiz.dto.techstack.TechStackRequestDTO;
import com.codebiz.dto.techstack.TechStackResponseDTO;
import com.codebiz.mapper.techstack.TechStackMapper;
import com.codebiz.model.TechStack;
import com.codebiz.model.TechStackCategory;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import jakarta.inject.Inject;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class TechStackService {

    @Inject
    TechStackDao techStackDao;

    @Inject
    TechStackCategoryDao categoryDao;

    // CREATE
    // -------------------------------------------------------------------------- >
    public TechStackResponseDTO create(TechStackRequestDTO dto) {

        ensureNameIsUnique(dto.tsName);
        Long category = requireCategory(dto.categoryId);

        TechStack entity = TechStackMapper.toEntity(dto, category);
        entity.createdAt = LocalDateTime.now();
        entity.updatedAt = LocalDateTime.now();

        techStackDao.create(entity);

        return TechStackMapper.toDTO(entity);
    }

    // READ
    // -------------------------------------------------------------------------- >
    public List<TechStackResponseDTO> listAll() {
        return techStackDao.findAll()
                .stream()
                .map(TechStackMapper::toDTO)
                .toList();
    }

    public TechStackResponseDTO getById(Long id) {
        TechStack entity = techStackDao.findById(id);

        if (entity == null)
            throw new NotFoundException("TechStack not found: " + id);

        return TechStackMapper.toDTO(entity);
    }

    // UPDATE
    // -------------------------------------------------------------------------- >
    public TechStackResponseDTO update(Long id, TechStackRequestDTO dto) {

        TechStack existing = techStackDao.findById(id);
        if (existing == null)
            throw new NotFoundException("TechStack not found: " + id);

        ensureNameIsUniqueForUpdate(id, dto.tsName);
        Long category = requireCategory(dto.categoryId);

        TechStackMapper.updateEntity(existing, dto, category);
        existing.updatedAt = LocalDateTime.now();

        techStackDao.update(existing);

        return TechStackMapper.toDTO(existing);
    }

    // DELETE
    // -------------------------------------------------------------------------- >
    public void delete(Long id) {
        TechStack existing = techStackDao.findById(id);
        if (existing == null)
            throw new NotFoundException("Tech not found: " + id);

        ensureNotUsedByproject(id);

        techStackDao.delete(existing);
    }

    // VALIDATION HELPERS
    // -------------------------------------------------------------------------- >

    // ENSURE UNIQUE BEFORE CREATE
    private void ensureNameIsUnique(String name) {
        boolean exists = techStackDao.existsByNameIgnoreCase(name);

        if (exists) {
            throw new BadRequestException("TechStack name already exists");
        }
    }

    // ENSURE UNIQUE BEFORE UPDATE
    private void ensureNameIsUniqueForUpdate(Long id, String name) {
        TechStack found = techStackDao.findByNameIgnoreCase(name);

        if (found != null && !found.id.equals(id)) {
            throw new BadRequestException("TechStack name already exists");
        }
    }

    // REQUIRE CATEGORY
    private Long requireCategory(Long id) {
        if (id == null)
            throw new BadRequestException("categoryId is required");

        TechStackCategory category = categoryDao.findById(id);
        if (category == null) {
            throw new NotFoundException("Category does not exist: " + id);
        }

        return category.id;
    }

    // ENSURE NO PROJECTS BEFORE DELETE
    private void ensureNotUsedByproject(Long techStackId) {
        boolean isUsedByProject = techStackDao.isUsedByProject(techStackId);

        if (isUsedByProject) {
            throw new BadRequestException("TechStack used by project/s");
        }
    }

}
