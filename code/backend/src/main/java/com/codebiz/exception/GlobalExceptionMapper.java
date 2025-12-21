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

                // ✅ LET JAX-RS HANDLE HTTP EXCEPTIONS PROPERLY
                if (ex instanceof jakarta.ws.rs.WebApplicationException wae) {
                        return Response
                                        .status(wae.getResponse().getStatus())
                                        .entity(new ErrorResponse(
                                                        wae.getResponse().getStatus(),
                                                        ex.getMessage()))
                                        .build();
                }

                // Handle validation errors (@Valid)
                if (ex instanceof ConstraintViolationException cve) {
                        Map<String, String> errors = cve.getConstraintViolations().stream()
                                        .collect(Collectors.toMap(
                                                        v -> v.getPropertyPath().toString(),
                                                        v -> v.getMessage()));

                        return Response.status(400)
                                        .entity(new ErrorResponse(
                                                        400,
                                                        "Validation Failed",
                                                        errors))
                                        .build();
                }

                // Fallback (real 500s only)
                return Response.status(500)
                                .entity(new ErrorResponse(
                                                500,
                                                "Internal Server Error"))
                                .build();
        }
}
