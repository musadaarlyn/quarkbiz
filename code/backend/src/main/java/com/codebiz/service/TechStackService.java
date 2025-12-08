package com.codebiz.service;

import com.codebiz.dto.techstack.TechStackRequestDTO;
import com.codebiz.mapper.techstack.TechStackMapper;
import com.codebiz.model.TechStack;
import com.codebiz.model.TechStackCategory;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class TechStackService {

    // CREATE
    @Transactional
    public TechStack create(TechStackRequestDTO dto) {

        TechStack entity = new TechStack();

        // Validate & load category (IMPORTANT)
        TechStackCategory category = TechStackCategory.findById(dto.categoryId);
        if (category == null) {
            throw new IllegalArgumentException("Category does not exist: " + dto.categoryId);
        }

        // Let mapper assign values
        TechStackMapper.updateEntity(entity, dto, category);

        entity.createdAt = LocalDateTime.now();
        entity.updatedAt = LocalDateTime.now();

        entity.persist();
        return entity;
    }

    // READ ALL
    public List<TechStack> listAll() {
        return TechStack.listAll();
    }

    // READ BY ID
    public TechStack getById(Long id) {
        return TechStack.findById(id);
    }

    // PAGINATION
    public List<TechStack> paginate(int page, int size) {
        return TechStack.findAll()
                .page(page, size)
                .list();
    }

    // SEARCH
    public List<TechStack> search(String name, int page, int size) {
        if (name == null || name.isEmpty()) {
            return paginate(page, size);
        }

        return TechStack.find("tsName LIKE ?1", "%" + name + "%")
                .page(page, size)
                .list();
    }

    // UPDATE
    @Transactional
    public TechStack update(Long id, TechStackRequestDTO dto) {

        TechStack existing = TechStack.findById(id);
        if (existing == null) {
            return null;
        }

        // Validate category
        TechStackCategory category = TechStackCategory.findById(dto.categoryId);
        if (category == null) {
            throw new IllegalArgumentException("Category does not exist: " + dto.categoryId);
        }

        TechStackMapper.updateEntity(existing, dto, category);

        existing.updatedAt = LocalDateTime.now();

        return existing;
    }

    // DELETE
    @Transactional
    public boolean delete(Long id) {
        return TechStack.deleteById(id);
    }
}
