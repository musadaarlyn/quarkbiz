package com.codebiz.auth.resource;

import com.codebiz.auth.dto.LoginRequestDTO;
import com.codebiz.auth.dto.LoginResponseDTO;
import com.codebiz.auth.service.AuthService;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService authService;

    // LOGIN
    // -------------------------------------------------------------------------- >
    @POST
    @Path("/login")
    @PermitAll
    public LoginResponseDTO login(@Valid LoginRequestDTO dto) {
        String token = authService.login(dto.username, dto.password);
        return new LoginResponseDTO(token);
    }
}
