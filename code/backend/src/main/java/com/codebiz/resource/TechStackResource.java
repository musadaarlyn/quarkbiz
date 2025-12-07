package com.codebiz.resource;

import com.codebiz.model.TechStack;
import com.codebiz.service.TechStackService;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/ts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TechStackResource {

    @Inject
    TechStackService service;

    // CREATE
    @POST
    public Response create(TechStack ts) {
        try {
            TechStack created = service.create(ts);
            return Response.status(Response.Status.CREATED).entity(created).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    // READ ALL
    @GET
    public List<TechStack> listAll() {
        return service.listAll();
    }

    // READ BY ID
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        TechStack ts = service.getById(id);
        return ts == null
                ? Response.status(Response.Status.NOT_FOUND).build()
                : Response.ok(ts).build();
    }

    // PAGINATION
    @GET
    @Path("/page")
    public List<TechStack> paginate(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        return service.paginate(page, size);
    }

    // SEARCH
    @GET
    @Path("/search")
    public List<TechStack> search(
            @QueryParam("keyword") String keyword,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        return service.search(keyword, page, size);
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, TechStack ts) {
        try {
            TechStack updated = service.update(id, ts);

            if (updated == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }

            return Response.ok(updated).build();

        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
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
