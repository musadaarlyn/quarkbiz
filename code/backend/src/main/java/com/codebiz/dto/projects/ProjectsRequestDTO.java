package com.codebiz.dto.projects;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ProjectsRequestDTO {

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 255)
    public String projName;

    @Size(max = 2000)
    public String projDescription;

    @NotNull(message = "techStackIds must not be null")
    public List<Long> techStackIds;

    @NotBlank(message = "Status is required")
    public String status;

    // Dates as strings — validated by parsing
    public String startDate;
    public String endDate;
}
