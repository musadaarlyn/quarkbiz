package com.codebiz.accounts.dto.users;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UsersRequestDTO {

    @NotBlank(message = "username is required")
    @Size(min = 6, max = 60)
    public String username;

    @NotBlank(message = "password is required")
    @Size(min = 6, max = 60)
    public String password;

    @NotBlank(message = "display name is required")
    @Size(min = 2, max = 60)
    public String displayName;

}
