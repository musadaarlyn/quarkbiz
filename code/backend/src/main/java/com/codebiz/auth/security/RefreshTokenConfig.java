package com.codebiz.auth.security;

import java.time.Duration;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.jwt.JsonWebToken;

import com.codebiz.accounts.model.users.User;

import io.smallrye.jwt.auth.principal.JWTParser;
import io.smallrye.jwt.build.Jwt;

@ApplicationScoped
public class RefreshTokenConfig {

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String issuer;

    @Inject
    JWTParser jwtParser;

    /**
     * Create a long-lived refresh token (stateless JWT).
     * Contains typ=refresh claim so we can distinguish it from access tokens.
     */
    public String generateRefreshToken(User user) {
        return Jwt.issuer(issuer)
                .upn(user.username)
                .claim("userId", user.id)
                .claim("typ", "refresh")
                .expiresIn(Duration.ofDays(7))
                .sign();
    }

    /**
     * Verify a refresh token and extract the userId.
     * Throws SecurityException on invalid token.
     */
    public Long verifyAndExtractUserId(String refreshToken) {
        try {
            JsonWebToken jwt = jwtParser.parse(refreshToken);

            // validate token type
            Object typ = jwt.getClaim("typ");
            if (!"refresh".equals(typ)) {
                throw new SecurityException("Not a refresh token");
            }

            // extract userId
            Object userIdObj = jwt.getClaim("userId");
            Long userId;
            if (userIdObj != null) {
                userId = Long.parseLong(userIdObj.toString());
            } else {
                throw new SecurityException("Missing userId claim");
            }

            return userId;

        } catch (Exception e) {
            throw new SecurityException("Invalid refresh token", e);
        }
    }
}
