package com.codebiz.resource;

import io.quarkus.panache.common.Sort;
import io.quarkus.hibernate.orm.panache.PanacheQuery;

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

    // SEARCH AND FILTER
    @GET
    @Path("/search")
    public List<TechStack> search(
            @QueryParam("name") String name,
            @QueryParam("categoryId") Long categoryId,
            @QueryParam("sort") @DefaultValue("id") String sort,
            @QueryParam("direction") @DefaultValue("asc") String direction,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {

        Sort sortOrder = direction.equalsIgnoreCase("desc")
                ? Sort.by(sort).descending()
                : Sort.by(sort).ascending();

        PanacheQuery<TechStack> pq;

        // Build filters dynamically
        if (name != null && !name.isEmpty() && categoryId != null) {
            pq = TechStack.find(
                    "tsName LIKE ?1 AND categoryId = ?2",
                    sortOrder,
                    "%" + name + "%",
                    categoryId
            );
        } else if (name != null && !name.isEmpty()) {
            pq = TechStack.find("tsName LIKE ?1", sortOrder, "%" + name + "%");
        } else if (categoryId != null) {
            pq = TechStack.find("categoryId = ?1", sortOrder, categoryId);
        } else {
            pq = TechStack.findAll(sortOrder);
        }

        return pq.page(page, size).list();
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

}
