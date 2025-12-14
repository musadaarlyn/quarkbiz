package com.codebiz.dto.dashboard;

import java.util.List;

public class DashboardStatsDTO {
    public long totalProjects;
    public List<StatusCountDTO> projectStatuses;
    public List<CategoryTechStackCountDTO> techStacksPerCategory;
    public List<TechStackUsageDTO> techStackUsage;
}