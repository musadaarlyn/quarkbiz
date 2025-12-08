package com.codebiz.resource;

import com.codebiz.dto.projects.ProjectsRequestDTO;
import com.codebiz.dto.projects.ProjectsResponseDTO;
import com.codebiz.service.ProjectsService;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
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
    public Response create(ProjectsRequestDTO dto) {
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
        if (dto == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(dto).build();
    }

    // SEARCH + FILTER + SORT + PAGINATION
    @GET
    @Path("/search")
    public List<ProjectsResponseDTO> search(
            @QueryParam("name") String name,
            @QueryParam("status") String status,
            @QueryParam("sort") @DefaultValue("id") String sort,
            @QueryParam("direction") @DefaultValue("asc") String direction,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        return service.search(name, status, sort, direction, page, size);
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, ProjectsRequestDTO dto) {
        ProjectsResponseDTO updated = service.update(id, dto);

        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(updated).build();
    }

    // DELETE
    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = service.delete(id);

        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.noContent().build();
    }
}
