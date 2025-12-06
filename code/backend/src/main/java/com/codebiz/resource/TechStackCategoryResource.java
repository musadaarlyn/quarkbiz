package com.codebiz.resource;

import com.codebiz.model.TechStackCategory;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TechStackCategoryResource {

    // CREATE 
    @POST
    @Transactional
    public Response create(TechStackCategory category) {
        category.persist();
        return Response.status(Response.Status.CREATED).entity(category).build();
    }

    // READ ALL 
    @GET
    public List<TechStackCategory> listAll() {
        return TechStackCategory.listAll();
    }

    // READ BY ID
    @GET
    @Path("/{id}")
    public TechStackCategory getById(@PathParam("id") Long id) {
        return TechStackCategory.findById(id);
    }

    // UPDATE 
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, TechStackCategory updated) {
        TechStackCategory category = TechStackCategory.findById(id);
        if (category == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        category.tscName = updated.tscName;
        category.tscDescription = updated.tscDescription;
        
        return Response.ok(category).build();
    }

    // DELETE 
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = TechStackCategory.deleteById(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }

    // PAGINATION
    @GET
    @Path("/page")
    public List<TechStackCategory> paginate(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {

        return TechStackCategory.findAll()
                .page(page, size)
                .list();
    }

}
