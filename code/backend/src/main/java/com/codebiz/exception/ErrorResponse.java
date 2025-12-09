package com.codebiz.exception;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {
    public int status;
    public String message;
    public LocalDateTime timestamp = LocalDateTime.now();
    public Map<String, String> errors; // For validation errors

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public ErrorResponse(int status, String message, Map<String, String> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}
