package com.codebiz.resource;

import com.codebiz.dto.techstack.TechStackRequestDTO;
import com.codebiz.dto.techstack.TechStackResponseDTO;
import com.codebiz.mapper.techstack.TechStackMapper;
import com.codebiz.model.TechStack;
import com.codebiz.service.TechStackService;

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
    @Transactional
    public Response create(@Valid TechStackRequestDTO dto) {
        TechStack created = service.create(dto);
        return Response.status(Response.Status.CREATED)
                .entity(TechStackMapper.toDTO(created))
                .build();
    }

    // READ ALL
    @GET
    public List<TechStackResponseDTO> listAll() {
        return service.listAll()
                .stream()
                .map(TechStackMapper::toDTO)
                .toList();
    }

    // READ BY ID
    @GET
    @Path("/{id}")
    public TechStackResponseDTO getById(@PathParam("id") Long id) {
        TechStack entity = service.getById(id);
        return TechStackMapper.toDTO(entity);
    }

    // PAGINATION
    @GET
    @Path("/page")
    public List<TechStackResponseDTO> paginate(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        return service.paginate(page, size)
                .stream()
                .map(TechStackMapper::toDTO)
                .toList();
    }

    // SEARCH
    @GET
    @Path("/search")
    public List<TechStackResponseDTO> search(
            @QueryParam("name") String name,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size
    ) {
        return service.search(name, page, size)
                .stream()
                .map(TechStackMapper::toDTO)
                .toList();
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(
            @PathParam("id") Long id,
            @Valid TechStackRequestDTO dto
    ) {
        TechStack updated = service.update(id, dto);
        return Response.ok(TechStackMapper.toDTO(updated)).build();
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
