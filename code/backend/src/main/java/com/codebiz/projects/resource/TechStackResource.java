package com.codebiz.projects.resource;

import com.codebiz.projects.dto.techstack.TechStackRequestDTO;
import com.codebiz.projects.dto.techstack.TechStackResponseDTO;
import com.codebiz.projects.service.TechStackService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/techstack")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TechStackResource {

    @Inject
    TechStackService service;

    // CREATE
    @POST
    @RolesAllowed("Admin")
    @Transactional
    public Response create(@Valid TechStackRequestDTO dto) {
        TechStackResponseDTO created = service.create(dto);
        return Response.status(Response.Status.CREATED)
                .entity(created)
                .build();
    }

    // READ ALL
    @GET
    @RolesAllowed("User")
    public List<TechStackResponseDTO> listAll() {
        return service.listAll();
    }

    // READ BY ID
    @GET
    @Path("/{id}")
    @RolesAllowed("User")
    public Response getById(@PathParam("id") Long id) {
        TechStackResponseDTO dto = service.getById(id);
        return Response.ok(dto).build();
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    @RolesAllowed("Admin")
    @Transactional
    public Response update(
            @PathParam("id") Long id,
            @Valid TechStackRequestDTO dto) {
        TechStackResponseDTO updated = service.update(id, dto);
        return Response.ok(updated).build();
    }

    // DELETE
    @DELETE
    @Path("/{id}")
    @RolesAllowed("Admin")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
