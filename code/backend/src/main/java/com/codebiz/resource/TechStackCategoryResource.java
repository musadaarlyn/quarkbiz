package com.codebiz.resource;

import com.codebiz.model.TechStackCategory;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
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

    // SEARCH AND FILTER
    @GET
    @Path("/search")
    public List<TechStackCategory> search(
            @QueryParam("name") String name,
            @QueryParam("sort") @DefaultValue("id") String sort,
            @QueryParam("direction") @DefaultValue("asc") String direction,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {

        // Build the Sort object from query params
        Sort sortOrder = direction.equalsIgnoreCase("desc")
                ? Sort.by(sort).descending()
                : Sort.by(sort).ascending();

        PanacheQuery<TechStackCategory> pq;

        if (name != null && !name.isEmpty()) {
            pq = TechStackCategory.find("tscName LIKE ?1", sortOrder, "%" + name + "%");
        } else {
            pq = TechStackCategory.findAll(sortOrder);
        }

        return pq.page(page, size).list();
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

}
