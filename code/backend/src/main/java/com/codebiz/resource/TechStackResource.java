package com.codebiz.resource;

import com.codebiz.model.TechStack;
import com.codebiz.model.TechStackCategory;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/techstack")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TechStackResource {

    // CREATE
    @POST
    @Transactional
    public Response create(TechStack data) {

        // Validate category exists
        if (data.category != null && data.category.id != null) {
            TechStackCategory cat = TechStackCategory.findById(data.category.id);
            if (cat == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Category with ID " + data.category.id + " does not exist.")
                        .build();
            }
            data.category = cat;
        }

        data.persist();
        return Response.status(Response.Status.CREATED).entity(data).build();
    }

    // READ ALL
    @GET
    public List<TechStack> listAll() {
        return TechStack.listAll();
    }

    // READ BY ID
    @GET
    @Path("/{id}")
    public TechStack getById(@PathParam("id") Long id) {
        return TechStack.findById(id);
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, TechStack updated) {

        TechStack ts = TechStack.findById(id);
        if (ts == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        ts.tsName = updated.tsName;
        ts.tsDescription = updated.tsDescription;

        // update category
        if (updated.category != null && updated.category.id != null) {
            TechStackCategory cat = TechStackCategory.findById(updated.category.id);
            if (cat == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Category with ID " + updated.category.id + " does not exist.")
                        .build();
            }
            ts.category = cat;
        }

        return Response.ok(ts).build();
    }

    // DELETE
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = TechStack.deleteById(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }

    // PAGINATION
    @GET
    @Path("/page")
    public List<TechStack> paginate(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {

        return TechStack.findAll()
                .page(page, size)
                .list();
    }

}
