package com.codebiz.projects.dto.dashboard;

public class StatusCountDTO {
    public String status;
    public long count;

    public StatusCountDTO(String status, long count) {
        this.status = status;
        this.count = count;
    }
}