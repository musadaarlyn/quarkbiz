package com.codebiz.resource;

import com.codebiz.dto.projects.ProjectsRequestDTO;
import com.codebiz.dto.projects.ProjectsResponseDTO;
import com.codebiz.service.ProjectsService;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/projects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProjectsResource {

    @Inject
    ProjectsService service;

    // CREATE
    @POST
    @Transactional
    public Response create(@Valid ProjectsRequestDTO dto) {
        ProjectsResponseDTO created = service.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    // READ ALL
    @GET
    public List<ProjectsResponseDTO> listAll() {
        return service.getAll();
    }

    // READ BY ID
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        ProjectsResponseDTO dto = service.getById(id);
        return Response.ok(dto).build();
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, @Valid ProjectsRequestDTO dto) {
        ProjectsResponseDTO updated = service.update(id, dto);
        return Response.ok(updated).build();
    }

    // DELETE
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
