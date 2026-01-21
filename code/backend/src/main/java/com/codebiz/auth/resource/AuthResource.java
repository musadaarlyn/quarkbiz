package com.codebiz.auth.resource;

import com.codebiz.auth.dto.LoginRequestDTO;
import com.codebiz.auth.dto.AuthResponseDTO;
import com.codebiz.auth.security.JwtConfig;
import com.codebiz.auth.security.RefreshTokenConfig;
import com.codebiz.auth.service.AuthService;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import java.util.Set;

import com.codebiz.accounts.model.users.User;
import com.codebiz.accounts.service.users.UsersService;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    AuthService authService;

    @Inject
    JwtConfig jwtConfig;

    @Inject
    RefreshTokenConfig refreshTokenConfig;

    @Inject
    UsersService usersService;

    // LOGIN
    // -------------------------------------------------------------------------- >
    @POST
    @Path("/login")
    @PermitAll
    public Response login(@Valid LoginRequestDTO dto) {
        User user = authService.login(dto.username, dto.password);

        // roles are hardcoded for now, can be DB-driven later
        String token = jwtConfig.generateToken(
                user.id,
                user.username,
                Set.of("User"));

        // create long-lived refresh token
        String refreshToken = refreshTokenConfig.generateRefreshToken(user);

        NewCookie refreshCookie = new NewCookie(
                "refreshToken",
                refreshToken,
                "/auth",
                null,
                null,
                7 * 24 * 60 * 60,
                false,
                true);

        return Response.ok(new AuthResponseDTO(token))
                .cookie(refreshCookie)
                .build();
    }

    @POST
    @Path("/refresh")
    @Produces(MediaType.APPLICATION_JSON)
    public Response refresh(@CookieParam("refreshToken") String refreshToken) {

        if (refreshToken == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        try {
            Long userId = refreshTokenConfig.verifyAndExtractUserId(refreshToken);

            User user = usersService.findById(userId);
            if (user == null) {
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }

            String token = jwtConfig.generateToken(
                    user.id,
                    user.username,
                    Set.of("User"));

            return Response.ok(new AuthResponseDTO(token)).build();

        } catch (SecurityException e) {
            e.printStackTrace();
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }

}
