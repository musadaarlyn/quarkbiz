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
import java.util.stream.Collectors;

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
        TechStackResponseDTO response = TechStackMapper.toDTO(created);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    // READ ALL
    @GET
    public List<TechStackResponseDTO> listAll() {
        return service.listAll()
                .stream()
                .map(TechStackMapper::toDTO)
                .collect(Collectors.toList());
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
                .collect(Collectors.toList());
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
                .collect(Collectors.toList());
    }

    // UPDATE
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(
            @PathParam("id") Long id, @Valid
            TechStackRequestDTO dto
    ) {
        TechStack updated = service.update(id, dto);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        TechStackResponseDTO response = TechStackMapper.toDTO(updated);
        return Response.ok(response).build();
    }

    // DELETE
    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = service.delete(id);

        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.noContent().build();
    }
}
