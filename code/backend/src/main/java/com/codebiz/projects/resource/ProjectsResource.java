package com.codebiz.projects.resource;

import com.codebiz.projects.dto.projects.ProjectsRequestDTO;
import com.codebiz.projects.dto.projects.ProjectsResponseDTO;
import com.codebiz.projects.service.ProjectsService;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/projects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("User") // only allows authenticated callers with the "User" role
public class ProjectsResource {

    @Inject
    ProjectsService service;

    @Inject
    JsonWebToken jwt;

    // CREATE
    @POST
    @Path("/create")
    @Transactional
    public Response create(@Valid ProjectsRequestDTO dto) {
        Object raw = jwt.getClaim("userId");
        if (raw == null) {
            throw new WebApplicationException("Missing userId claim", Response.Status.UNAUTHORIZED);
        }
        Long currentUserId = (raw instanceof Number) ? ((Number) raw).longValue() : Long.parseLong(raw.toString());
        ProjectsResponseDTO created = service.create(dto, currentUserId);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    // READ ALL BY USER ID
    @GET
    @Path("/me")
    public List<ProjectsResponseDTO> getMyProjects() {
        Object raw = jwt.getClaim("userId");
        if (raw == null) {
            throw new WebApplicationException("Missing userId claim", Response.Status.UNAUTHORIZED);
        }
        Long currentUserId = (raw instanceof Number) ? ((Number) raw).longValue() : Long.parseLong(raw.toString());
        return service.getByUserId(currentUserId);
    }

    // GET a single project by ID, only if owned by user
    @GET
    @Path("/project/{id}")
    public Response getById(@PathParam("id") Long id) {
        Object raw = jwt.getClaim("userId");
        if (raw == null) {
            throw new WebApplicationException("Missing userId claim", Response.Status.UNAUTHORIZED);
        }
        Long currentUserId = (raw instanceof Number) ? ((Number) raw).longValue() : Long.parseLong(raw.toString());
        ProjectsResponseDTO dto = service.getById(id, currentUserId);
        return Response.ok(dto).build();
    }

    // UPDATE
    @PUT
    @Path("/project/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, @Valid ProjectsRequestDTO dto) {
        Object raw = jwt.getClaim("userId");
        if (raw == null) {
            throw new WebApplicationException("Missing userId claim", Response.Status.UNAUTHORIZED);
        }
        Long currentUserId = (raw instanceof Number) ? ((Number) raw).longValue() : Long.parseLong(raw.toString());
        ProjectsResponseDTO updated = service.update(id, dto, currentUserId);
        return Response.ok(updated).build();
    }

    // DELETE
    @DELETE
    @Path("project/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        Object raw = jwt.getClaim("userId");
        if (raw == null) {
            throw new WebApplicationException("Missing userId claim", Response.Status.UNAUTHORIZED);
        }
        Long currentUserId = (raw instanceof Number) ? ((Number) raw).longValue() : Long.parseLong(raw.toString());
        service.delete(id, currentUserId);
        return Response.noContent().build();
    }
}
