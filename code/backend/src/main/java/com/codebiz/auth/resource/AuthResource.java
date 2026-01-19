package com.codebiz.auth.resource;

import com.codebiz.auth.dto.LoginRequestDTO;
import com.codebiz.auth.dto.LoginResponseDTO;
import com.codebiz.auth.security.JwtConfig;
import com.codebiz.auth.service.AuthService;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.Set;

import com.codebiz.accounts.model.users.User;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService authService;

    @Inject
    JwtConfig jwtConfig;

    // LOGIN
    // -------------------------------------------------------------------------- >
    @POST
    @Path("/login")
    @PermitAll
    public LoginResponseDTO login(@Valid LoginRequestDTO dto) {
        User user = authService.login(dto.username, dto.password);

        // roles are hardcoded for now, can be DB-driven later
        String token = jwtConfig.generateToken(
                user.id,
                user.username,
                Set.of("User"));

        return new LoginResponseDTO(token);
    }
}
