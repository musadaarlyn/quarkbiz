package com.codebiz.accounts.resource.users;

import com.codebiz.accounts.dto.users.UsersRequestDTO;
import com.codebiz.accounts.dto.users.UsersResponseDTO;
import com.codebiz.accounts.service.users.UsersService;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UsersResource {

    @Inject
    UsersService usersService;

    // CREATE
    // --------------------------------------------------------------------------
    @POST
    @Path("/register")
    @PermitAll
    public Response create(@Valid UsersRequestDTO dto) {

        UsersResponseDTO createdUser = usersService.create(dto);

        return Response
                .status(Response.Status.CREATED)
                .entity(createdUser)
                .build();
    }
}
