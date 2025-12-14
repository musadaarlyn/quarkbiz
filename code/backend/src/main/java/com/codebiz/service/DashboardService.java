package com.codebiz.service;

import com.codebiz.dto.dashboard.*;
import com.codebiz.model.Projects;
import com.codebiz.model.TechStack;
import com.codebiz.model.TechStackCategory;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
public class DashboardService {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public DashboardStatsDTO getStats() {
        DashboardStatsDTO dto = new DashboardStatsDTO();

        List<Projects> projects = Projects.listAll();
        List<TechStack> techStacks = TechStack.listAll();
        List<TechStackCategory> categories = TechStackCategory.listAll();

        dto.totalProjects = projects.size();
        dto.projectStatuses = buildStatusCounts(projects);
        dto.techStacksPerCategory = buildCategoryCounts(techStacks, categories);
        dto.techStackUsage = buildTechStackUsage(projects, techStacks);

        return dto;
    }

    private List<StatusCountDTO> buildStatusCounts(List<Projects> projects) {
        return projects.stream()
                .collect(Collectors.groupingBy(p -> p.status == null ? "UNKNOWN" : p.status,
                        Collectors.counting()))
                .entrySet()
                .stream()
                .map(e -> new StatusCountDTO(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(sc -> sc.status))
                .toList();
    }

    private List<CategoryTechStackCountDTO> buildCategoryCounts(List<TechStack> stacks,
                                                                List<TechStackCategory> categories) {
        Map<Long, Long> counts = stacks.stream()
                .filter(ts -> ts.category != null && ts.category.id != null)
                .collect(Collectors.groupingBy(ts -> ts.category.id, Collectors.counting()));

        return categories.stream()
                .map(cat -> new CategoryTechStackCountDTO(
                        cat.id,
                        cat.tscName,
                        counts.getOrDefault(cat.id, 0L)))
                .sorted(Comparator.comparing(ct -> ct.categoryName))
                .toList();
    }

    private List<TechStackUsageDTO> buildTechStackUsage(List<Projects> projects,
                                                        List<TechStack> techStacks) {
        Map<Long, Long> usage = new HashMap<>();

        for (Projects project : projects) {
            readTechStackIds(project.techStackIds).forEach(id ->
                    usage.merge(id, 1L, Long::sum)
            );
        }

        return techStacks.stream()
                .map(stack -> new TechStackUsageDTO(
                        stack.id,
                        stack.tsName,
                        usage.getOrDefault(stack.id, 0L)))
                .sorted(Comparator.<TechStackUsageDTO>comparingLong(tsu -> tsu.projectCount)
                        .reversed()
                        .thenComparing(tsu -> tsu.techStackName))
                .toList();
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