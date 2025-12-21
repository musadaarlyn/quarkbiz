package com.codebiz.service;

import com.codebiz.dao.TechStackCategoryDao;
import com.codebiz.dto.category.TechStackCategoryRequestDTO;
import com.codebiz.dto.category.TechStackCategoryResponseDTO;
import com.codebiz.mapper.category.TechStackCategoryMapper;
import com.codebiz.model.TechStackCategory;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class TechStackCategoryService {

    @Inject
    TechStackCategoryDao categoryDao;

    // -------------------------------------
    // CREATE
    // -------------------------------------
    public TechStackCategoryResponseDTO create(TechStackCategoryRequestDTO dto) {

        ensureNameIsUnique(dto.tscName);

        TechStackCategory entity = TechStackCategoryMapper.toEntity(dto);
        entity.createdAt = LocalDateTime.now();
        entity.updatedAt = LocalDateTime.now();

        categoryDao.insert(entity);

        return TechStackCategoryMapper.toDTO(entity);
    }

    // -------------------------------------
    // READ ALL
    // -------------------------------------
    public List<TechStackCategoryResponseDTO> listAll() {
        return categoryDao.findAll()
                .stream()
                .map(TechStackCategoryMapper::toDTO)
                .toList();
    }

    // -------------------------------------
    // READ BY ID
    // -------------------------------------
    public TechStackCategoryResponseDTO findById(Long id) {
        TechStackCategory entity = categoryDao.findById(id);
        if (entity == null)
            throw new NotFoundException("Category not found");

        return TechStackCategoryMapper.toDTO(entity);
    }

    // -------------------------------------
    // PAGINATION
    // -------------------------------------
    public List<TechStackCategoryResponseDTO> paginate(int page, int size) {
        return categoryDao.findPaginated(page, size)
                .stream()
                .map(TechStackCategoryMapper::toDTO)
                .toList();
    }

    // -------------------------------------
    // SEARCH + SORT + PAGINATION
    // -------------------------------------
    public List<TechStackCategoryResponseDTO> search(
            String name,
            String sortField,
            String direction,
            int page,
            int size) {
        return categoryDao.search(name, sortField, direction, page, size)
                .stream()
                .map(TechStackCategoryMapper::toDTO)
                .toList();
    }

    // -------------------------------------
    // UPDATE
    // -------------------------------------
    public TechStackCategoryResponseDTO update(Long id, TechStackCategoryRequestDTO dto) {

        TechStackCategory existing = categoryDao.findById(id);
        if (existing == null)
            throw new NotFoundException("Category not found");

        ensureNameIsUniqueForUpdate(id, dto.tscName);

        TechStackCategoryMapper.updateEntity(existing, dto);
        existing.updatedAt = LocalDateTime.now();

        categoryDao.update(existing);

        return TechStackCategoryMapper.toDTO(existing);
    }

    // -------------------------------------
    // DELETE
    // -------------------------------------
    public boolean delete(Long id) {

        TechStackCategory existing = categoryDao.findById(id);
        if (existing == null)
            throw new NotFoundException("Category not found");

        ensureNoTechStacks(id);

        categoryDao.delete(id);
        return true;
    }

    // -------------------------------------
    // VALIDATION HELPERS
    // -------------------------------------

    private void ensureNameIsUnique(String name) {
        boolean exists = categoryDao.existsByNameIgnoreCase(name);
        if (exists) {
            throw new BadRequestException("Category name already exists");
        }
    }

    private void ensureNameIsUniqueForUpdate(Long id, String name) {
        TechStackCategory existing = categoryDao.findByNameIgnoreCase(name);
        if (existing != null && !existing.id.equals(id)) {
            throw new BadRequestException("Category name already exists");
        }
    }

    private void ensureNoTechStacks(Long categoryId) {
        long count = categoryDao.countTechStacks(categoryId);
        if (count > 0) {
            throw new BadRequestException(
                    "Cannot delete category while " + count + " tech stack(s) still reference it");
        }
    }
}
