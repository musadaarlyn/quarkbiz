package com.codebiz.auth.security;

import java.time.Duration;
import java.util.Set;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class JwtConfig {

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String issuer;

    public String generateToken(Long userId, String username, Set<String> roles) {
        return Jwt.issuer(issuer)
                .upn(username) // user principal name
                .claim("userId", userId) // custom claim
                .groups(roles)
                .expiresIn(Duration.ofMinutes(15))
                .sign();
    }
}