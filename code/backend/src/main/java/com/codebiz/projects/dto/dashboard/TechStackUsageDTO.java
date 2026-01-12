package com.codebiz.projects.dto.dashboard;

public class TechStackUsageDTO {
    public Long techStackId;
    public String techStackName;
    public long projectCount;

    public TechStackUsageDTO(Long techStackId, String techStackName, long projectCount) {
        this.techStackId = techStackId;
        this.techStackName = techStackName;
        this.projectCount = projectCount;
    }
}