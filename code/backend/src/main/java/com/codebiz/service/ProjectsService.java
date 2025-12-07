package com.codebiz.service;

import com.codebiz.model.Projects;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ProjectsService {

    public List<Projects> getAll() {
        return Projects.listAll();
    }

    @Transactional
    public Projects create(Projects project) {
        project.persist();
        return project;
    }

    public Projects findById(Long id) {
        return Projects.findById(id);
    }

    @Transactional
    public Projects update(Long id, Projects data) {
        Projects existing = Projects.findById(id);
        if (existing == null) return null;

        existing.projName = data.projName;
        existing.projDescription = data.projDescription;
        existing.techStackIds = data.techStackIds;
        existing.status = data.status;
        existing.startDate = data.startDate;
        existing.endDate = data.endDate;

        return existing;
    }

    @Transactional
    public boolean delete(Long id) {
        return Projects.deleteById(id);
    }

    public List<Projects> search(
            String name,
            String status,
            String sort,
            String direction,
            int page,
            int size
    ) {
        Sort sortOrder = direction.equalsIgnoreCase("desc")
                ? Sort.by(sort).descending()
                : Sort.by(sort).ascending();

        PanacheQuery<Projects> pq;

        if (name != null && !name.isBlank() && status != null && !status.isBlank()) {
            pq = Projects.find("projName LIKE ?1 AND status = ?2", sortOrder,
                    "%" + name + "%", status);
        }
        else if (name != null && !name.isBlank()) {
            pq = Projects.find("projName LIKE ?1", sortOrder, "%" + name + "%");
        }
        else if (status != null && !status.isBlank()) {
            pq = Projects.find("status = ?1", sortOrder, status);
        }
        else {
            pq = Projects.findAll(sortOrder);
        }

        return pq.page(page, size).list();
    }
}
