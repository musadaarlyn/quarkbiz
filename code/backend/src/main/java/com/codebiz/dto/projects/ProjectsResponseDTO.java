package com.codebiz.dto.projects;

import java.util.List;

public class ProjectsResponseDTO {
    public Long id;
    public String projName;
    public String projDescription;
    public List<Long> techStackIds;
    public String status;
    public String startDate;
    public String endDate;
    public String createdAt;
    public String updatedAt;
}

