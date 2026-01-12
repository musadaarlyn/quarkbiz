package com.codebiz.projects.dto.techstack;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TechStackRequestDTO {

    @NotBlank(message = "Tech stack name is required")
    @Size(min = 2, max = 255)
    public String tsName;

    @Size(max = 1000)
    public String tsDescription;

    @NotNull(message = "Category ID is required")
    public Long categoryId;
}
