package com.codebiz.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {
    @NotBlank
    public String username;

    @NotBlank
    public String password;
}
