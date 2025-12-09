package com.codebiz.resource;

import com.codebiz.model.TechStackCategory;
import com.codebiz.service.TechStackCategoryService;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TechStackCategoryResource {

    @Inject
    TechStackCategoryService service;

    // CREATE
    @POST
    @Transactional
    public Response create(@Valid TechStackCategory tsc) {
        TechStackCategory created = service.create(tsc);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    // READ ALL
    @GET
    public List<TechStackCategory> listAll() {
        return service.listAll();
    }

    // READ BY ID
    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        TechStackCategory cat = service.findById(id);
        return cat == null
                ? Response.status(Response.Status.NOT_FOUND).build()
                : Response.ok(cat).build();
    }

    // PAGINATION
    @GET
    @Path("/page")
    public List<TechStackCategory> paginate(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        return service.paginate(page, size);
    }

    // SEARCH + SORT
    @GET
    @Path("/search")
    public List<TechStackCategory> search(
            @QueryParam("name") String name,
            @QueryParam("sort") @DefaultValue("id") String sortField,
            @QueryParam("direction") @DefaultValue("asc") String direction,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        return service.search(name, sortField, direction, page, size);
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, @Valid TechStackCategory tsc) {
        TechStackCategory updated = service.update(id, tsc);
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
}
