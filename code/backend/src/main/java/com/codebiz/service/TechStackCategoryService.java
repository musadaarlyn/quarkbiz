package com.codebiz.service;

import com.codebiz.dto.category.TechStackCategoryRequestDTO;
import com.codebiz.dto.category.TechStackCategoryResponseDTO;
import com.codebiz.mapper.category.TechStackCategoryMapper;
import com.codebiz.model.TechStack;
import com.codebiz.model.TechStackCategory;

import io.quarkus.panache.common.Sort;
import io.quarkus.hibernate.orm.panache.PanacheQuery;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class TechStackCategoryService {

    // -------------------------------------
    // CRUD
    // -------------------------------------

    // CREATE
    @Transactional
    public TechStackCategoryResponseDTO create(TechStackCategoryRequestDTO dto) {

        ensureNameIsUnique(dto.tscName);

        TechStackCategory entity = TechStackCategoryMapper.toEntity(dto);
        entity.createdAt = LocalDateTime.now();
        entity.updatedAt = LocalDateTime.now();
        entity.persist();
        return TechStackCategoryMapper.toDTO(entity);
    }

    // READ ALL
    public List<TechStackCategoryResponseDTO> listAll() {
        return TechStackCategory.<TechStackCategory>listAll()
                .stream()
                .map(TechStackCategoryMapper::toDTO)
                .toList();
    }


    // READ BY ID
    public TechStackCategoryResponseDTO findById(Long id) {
        TechStackCategory entity = TechStackCategory.findById(id);
        if (entity == null) throw new NotFoundException("Category not found");
        return TechStackCategoryMapper.toDTO(entity);
    }


    // PAGINATION
    public List<TechStackCategoryResponseDTO> paginate(int page, int size) {
    return TechStackCategory.<TechStackCategory>findAll()
            .page(page, size)
            .list()
            .stream()
            .map(TechStackCategoryMapper::toDTO)
            .toList();
    }


    // SEARCH + SORT + PAGINATION
    public List<TechStackCategoryResponseDTO> search(
            String name,
            String sortField,
            String direction,
            int page,
            int size
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        PanacheQuery<TechStackCategory> query;

        if (name != null && !name.isBlank()) {
            query = TechStackCategory.<TechStackCategory>find(
        "tscName LIKE ?1", sort, "%" + name + "%"
            );
        } else {
            query = TechStackCategory.<TechStackCategory>findAll(sort);
        }

        return query.page(page, size)
                    .list()
                    .stream()
                    .map(TechStackCategoryMapper::toDTO)
                    .toList();
    }

    // UPDATE
    @Transactional
    public TechStackCategoryResponseDTO update(Long id, TechStackCategoryRequestDTO dto) {
        TechStackCategory existing = TechStackCategory.findById(id);
        if (existing == null) throw new NotFoundException("Category not found");

        ensureNameIsUniqueForUpdate(id, dto.tscName);

        TechStackCategoryMapper.updateEntity(existing, dto);
        existing.updatedAt = LocalDateTime.now();

        return TechStackCategoryMapper.toDTO(existing);
    }

    // DELETE
    @Transactional
    public boolean delete(Long id) {
        TechStackCategory existing = TechStackCategory.findById(id);
        if (existing == null) throw new NotFoundException("Category not found");

        ensureNoTechStacks(id);

        existing.delete();
        return true;
    }

    // -------------------------------------
    // VALIDATION HELPERS
    // -------------------------------------

    // ENSURE UNIQUE BEFORE CREATE
    private void ensureNameIsUnique(String name) {
        boolean exists = TechStackCategory.find("LOWER(tscName) = LOWER(?1)", name).firstResult() != null;
        if (exists) {
            throw new BadRequestException("Category name already exists");
        }
    }

    // ENSURE UNIQUE BEFORE UPDATE
    private void ensureNameIsUniqueForUpdate(Long id, String name) {
        TechStackCategory existing = TechStackCategory.find("LOWER(tscName) = LOWER(?1)", name).firstResult();

        if (existing != null && !existing.id.equals(id)) {
            throw new BadRequestException("Category name already exists");
        }
    }

    // ENSURE NO TECH STACK BEFORE DELETE
    private void ensureNoTechStacks(Long categoryId) {
        long stackCount = TechStack.count("category.id = ?1", categoryId);
        if (stackCount > 0) {
            throw new BadRequestException(
                "Cannot delete category while " + stackCount + " tech stack(s) still reference it");
        }
    }
}
