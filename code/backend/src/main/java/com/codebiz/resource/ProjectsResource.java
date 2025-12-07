package com.codebiz.resource;

import com.codebiz.model.Projects;
import com.codebiz.service.ProjectsService;

import jakarta.inject.Inject;
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
    public Response create(Projects project) {
        Projects created = service.create(project);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    // READ ALL
    @GET
    public List<Projects> getAll() {
        return service.getAll();
    }

    // READ BY ID
    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        Projects p = service.findById(id);
        return p == null
                ? Response.status(Response.Status.NOT_FOUND).build()
                : Response.ok(p).build();
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, Projects data) {
        Projects updated = service.update(id, data);
        return updated == null
                ? Response.status(Response.Status.NOT_FOUND).build()
                : Response.ok(updated).build();
    }

    // DELETE
    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = service.delete(id);
        return deleted
                ? Response.noContent().build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }

    // SEARCH
    @GET
    @Path("/search")
    public List<Projects> search(
            @QueryParam("name") String name,
            @QueryParam("status") String status,
            @QueryParam("sort") @DefaultValue("id") String sort,
            @QueryParam("direction") @DefaultValue("asc") String direction,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        return service.search(name, status, sort, direction, page, size);
    }
}
