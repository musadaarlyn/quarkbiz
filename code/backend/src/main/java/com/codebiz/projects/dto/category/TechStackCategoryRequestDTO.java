package com.codebiz.projects.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TechStackCategoryRequestDTO {

    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
    public String tscName;

    @Size(max = 1000, message = "Description too long")
    public String tscDescription;
}
