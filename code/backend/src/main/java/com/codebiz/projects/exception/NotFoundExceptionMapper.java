package com.codebiz.projects.exception;

import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class NotFoundExceptionMapper implements ExceptionMapper<NotFoundException> {

    @Override
    public Response toResponse(NotFoundException ex) {

        ErrorResponse error = new ErrorResponse(
                404,
                ex.getMessage() != null ? ex.getMessage() : "Not Found");

        return Response.status(404).entity(error).build();
    }
}
