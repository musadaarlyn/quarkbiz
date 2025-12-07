package com.codebiz.service;

import com.codebiz.model.TechStackCategory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class TechStackCategoryService {

    // CREATE
    @Transactional
    public TechStackCategory create(TechStackCategory category) {
        category.createdAt = LocalDateTime.now();
        category.updatedAt = LocalDateTime.now();
        category.persist();
        return category;
    }

    // READ ALL
    public List<TechStackCategory> listAll() {
        return TechStackCategory.listAll();
    }

    // READ BY ID
    public TechStackCategory findById(Long id) {
        return TechStackCategory.findById(id);
    }

    // PAGINATION
    public List<TechStackCategory> paginate(int page, int size) {
        return TechStackCategory.findAll()
                .page(page, size)
                .list();
    }

    // SEARCH + SORT
    public List<TechStackCategory> search(String name, String sortField, String direction, int page, int size) {

        var sort = direction.equalsIgnoreCase("desc")
                ? io.quarkus.panache.common.Sort.by(sortField).descending()
                : io.quarkus.panache.common.Sort.by(sortField).ascending();

        if (name != null && !name.isEmpty()) {
            return TechStackCategory.find("tscName LIKE ?1", sort, "%" + name + "%")
                    .page(page, size)
                    .list();
        }

        return TechStackCategory.findAll(sort)
                .page(page, size)
                .list();
    }

    // UPDATE
    @Transactional
    public TechStackCategory update(Long id, TechStackCategory updated) {
        TechStackCategory existing = TechStackCategory.findById(id);
        if (existing == null) return null;

        existing.tscName = updated.tscName;
        existing.tscDescription = updated.tscDescription;
        existing.updatedAt = LocalDateTime.now();

        return existing;
    }

    // DELETE
    @Transactional
    public boolean delete(Long id) {
        return TechStackCategory.deleteById(id);
    }
}
