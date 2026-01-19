package com.codebiz.auth.service;

import com.codebiz.accounts.dao.UsersDao;
import com.codebiz.accounts.model.users.User;

import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class AuthService {

    @Inject
    UsersDao usersDao;

    // LOGIN
    // -------------------------------------------------------------------------- >
    public User login(String username, String password) {

        User user = usersDao.findByUsername(username);

        if (user == null || !BcryptUtil.matches(password, user.password_hash)) {
            throw new WebApplicationException(
                    "Invalid credentials",
                    Response.Status.UNAUTHORIZED);
        }

        return user;
    }
}
