package com.codebiz.projects.resource;

import com.codebiz.projects.dto.category.TechStackCategoryRequestDTO;
import com.codebiz.projects.dto.category.TechStackCategoryResponseDTO;
import com.codebiz.projects.service.TechStackCategoryService;

import jakarta.annotation.security.RolesAllowed;
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
@RolesAllowed("Admin")
public class TechStackCategoryResource {

    @Inject
    TechStackCategoryService service;

    // CREATE
    @POST
    @Transactional
    public Response create(@Valid TechStackCategoryRequestDTO dto) {
        TechStackCategoryResponseDTO created = service.create(dto);
        return Response.status(Response.Status.CREATED)
                .entity(created)
                .build();
    }

    // READ ALL
    @GET
    public List<TechStackCategoryResponseDTO> listAll() {
        return service.listAll();
    }

    // READ BY ID
    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        TechStackCategoryResponseDTO dto = service.findById(id);
        return Response.ok(dto).build();
    }

    // PAGINATION
    @GET
    @Path("/page")
    public List<TechStackCategoryResponseDTO> paginate(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {
        return service.paginate(page, size);
    }

    // SEARCH + SORT
    @GET
    @Path("/search")
    public List<TechStackCategoryResponseDTO> search(
            @QueryParam("name") String name,
            @QueryParam("sort") @DefaultValue("id") String sortField,
            @QueryParam("direction") @DefaultValue("asc") String direction,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {
        return service.search(name, sortField, direction, page, size);
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, @Valid TechStackCategoryRequestDTO dto) {
        TechStackCategoryResponseDTO updated = service.update(id, dto);
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
