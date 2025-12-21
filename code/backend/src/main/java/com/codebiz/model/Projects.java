package com.codebiz.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class Projects {

    public Long id;

    public String projName;

    public String projDescription;

    public List<Long> techStackIds;

    public String status;

    public LocalDate startDate;

    public LocalDate endDate;

    public LocalDateTime createdAt;

    public LocalDateTime updatedAt;
}
