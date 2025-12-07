package com.codebiz.service;

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
    public TechStack create(TechStack ts) {
        // Validate category
        if (ts.category != null) {
            TechStackCategory category = TechStackCategory.findById(ts.category);
            if (category == null) {
                throw new IllegalArgumentException("Category does not exist: " + ts.category);
            }
        }

        ts.createdAt = LocalDateTime.now();
        ts.persist();
        return ts;
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
    public TechStack update(Long id, TechStack data) {
        TechStack existing = TechStack.findById(id);
        if (existing == null) {
            return null;
        }

        // Validate category if changed
        if (data.category != null) {
            if (TechStackCategory.findById(data.category) == null) {
                throw new IllegalArgumentException("Category does not exist: " + data.category);
            }
        }

        existing.tsName = data.tsName;
        existing.tsDescription = data.tsDescription;
        existing.category = data.category;
        existing.updatedAt = LocalDateTime.now();

        return existing;
    }

    // DELETE
    @Transactional
    public boolean delete(Long id) {
        return TechStack.deleteById(id);
    }
}
