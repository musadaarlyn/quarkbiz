package com.codebiz.auth.service;

import java.util.Set;

import com.codebiz.accounts.dao.UsersDao;
import com.codebiz.accounts.model.users.User;
import com.codebiz.auth.security.JwtConfig;

import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class AuthService {

    @Inject
    UsersDao usersDao;

    @Inject
    JwtConfig jwtConfig;

    // LOGIN
    // -------------------------------------------------------------------------- >
    public String login(String username, String password) {

        User user = usersDao.findByUsername(username);

        if (user == null || !BcryptUtil.matches(password, user.password_hash)) {
            throw new WebApplicationException(
                    "Invalid credentials",
                    Response.Status.UNAUTHORIZED);
        }

        // roles are hardcoded for now, can be DB-driven later
        return jwtConfig.generateToken(
                user.id,
                user.username,
                Set.of("User"));
    }
}
