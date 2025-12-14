package com.codebiz.dto.dashboard;

public class CategoryTechStackCountDTO {
    public Long categoryId;
    public String categoryName;
    public long techStackCount;

    public CategoryTechStackCountDTO(Long categoryId, String categoryName, long techStackCount) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.techStackCount = techStackCount;
    }
}