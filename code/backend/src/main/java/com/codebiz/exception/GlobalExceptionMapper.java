package com.codebiz.exception;

import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Map;
import java.util.stream.Collectors;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception ex) {

        // Handle validation errors (from @Valid)
        if (ex instanceof ConstraintViolationException cve) {
            Map<String, String> errors = cve.getConstraintViolations().stream()
                    .collect(Collectors.toMap(
                            v -> v.getPropertyPath().toString(),
                            v -> v.getMessage()
                    ));

            ErrorResponse error = new ErrorResponse(
                    400,
                    "Validation Failed",
                    errors
            );

            return Response.status(400).entity(error).build();
        }

        // Default fallback for all other errors
        ErrorResponse error = new ErrorResponse(
                500,
                ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"
        );

        return Response.status(500).entity(error).build();
    }
}
