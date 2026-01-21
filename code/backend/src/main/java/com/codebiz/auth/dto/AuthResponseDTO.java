package com.codebiz.auth.dto;

public class AuthResponseDTO {
    public String accessToken;

    public AuthResponseDTO(String accessToken) {
        this.accessToken = accessToken;
    }
}
