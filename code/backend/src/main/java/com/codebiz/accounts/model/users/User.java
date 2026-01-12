package com.codebiz.accounts.model.users;

import java.time.LocalDateTime;

public class User {
    public Long id;
    public String username;
    public String password_hash;
    public String displayName;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}
