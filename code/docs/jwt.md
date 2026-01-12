# JWT Authentication & Authorization (QuarkBiz Backend)

uses **Quarkus 3.x** with **SmallRye JWT** for stateless authentication via signed JWT tokens.

## Overview

- **Login**: `POST /auth/login` verifies username/password and returns a signed JWT.
- **Authorization**: Protected endpoints use `@RolesAllowed(...)`. The user's roles are read from the JWT `groups` claim.
- **Identity**: The JWT also includes a custom `userId` claim used by business endpoints (e.g., projects) to associate data with the authenticated user.

---

## Dependencies

Configured in [pom.xml](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/backend/pom.xml:0:0-0:0):

- `io.quarkus:quarkus-smallrye-jwt-build`
  - Used to **sign/generate** tokens (build JWTs)
- `io.quarkus:quarkus-smallrye-jwt`
  - Used to **verify/parse** tokens and enforce `@RolesAllowed`
- `io.quarkus:quarkus-elytron-security-common`
  - Used for `BcryptUtil` password verification

---

## Key Files and Configuration

### Key pair files

Located in:

- [src/main/resources/publicKey.pem](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/backend/src/main/resources/publicKey.pem:0:0-0:0)
- [src/main/resources/privateKey.pem](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/backend/src/main/resources/privateKey.pem:0:0-0:0)

The private key is used for **signing** tokens.
The public key is used for **verifying** tokens.

### application.properties (JWT-related)

File: [src/main/resources/application.properties](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/backend/src/main/resources/application.properties:0:0-0:0)

Required properties:

- `mp.jwt.verify.issuer=http://localhost:8080`
- `mp.jwt.verify.publickey.location=publicKey.pem`
- `smallrye.jwt.sign.key.location=privateKey.pem`

**Important**: Do not leave trailing spaces in this file. Trailing spaces can break issuer verification and cause authentication failures.

---

## Login Flow (Token Generation)

### Endpoint

- `POST /auth/login`

Code: [com.codebiz.auth.resource.AuthResource](cci:2://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/backend/src/main/java/com/codebiz/auth/resource/AuthResource.java:15:0-32:1)

- Marked `@PermitAll` so it does not require authentication.

### Service logic

Code: [com.codebiz.auth.service.AuthService](cci:2://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/backend/src/main/java/com/codebiz/auth/service/AuthService.java:14:0-41:1)

- Looks up the user by username via `UsersDao`
- Verifies password using `BcryptUtil.matches(password, user.password_hash)`
- Generates token with hardcoded role(s) for now:
  - `Set.of("User")`

### Token creation

Code: [com.codebiz.auth.security.JwtConfig](cci:2://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/backend/src/main/java/com/codebiz/auth/security/JwtConfig.java:8:0-22:1)

Token is built using SmallRye JWT builder:

- `issuer(issuer)` uses `mp.jwt.verify.issuer`
- `upn(username)` sets the principal username
- `.claim("userId", userId)` adds a custom claim used by API resources
- `.groups(roles)` sets the roles for `@RolesAllowed(...)`
- `.expiresIn(Duration.ofHours(2))` token expiry
- `.sign()` signs the token with [privateKey.pem](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/backend/target/classes/privateKey.pem:0:0-0:0)

---

## Token Claims Used

### Standard/Quarkus-relevant claims

- `iss` (issuer)
  - Must match `mp.jwt.verify.issuer`
- `upn`
  - Username / principal name
- `groups`
  - Roles used by `@RolesAllowed`

### Custom claim

- `userId`
  - Used by resources/services to operate on the current user’s data.

---

## Authorization (Protecting Endpoints)

Endpoints are protected with annotations such as:

- `@RolesAllowed("User")`
- `@RolesAllowed("Admin")`

Example: [com.codebiz.projects.resource.ProjectsResource](cci:2://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/backend/src/main/java/com/codebiz/projects/resource/ProjectsResource.java:18:0-96:1)

At runtime Quarkus:

- Extracts `Authorization: Bearer <token>`
- Verifies signature using [publicKey.pem](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/backend/target/classes/publicKey.pem:0:0-0:0)
- Verifies issuer matches
- Builds `SecurityIdentity` + role mapping from `groups`
- Enforces `@RolesAllowed(...)` before calling endpoint method

---

## Reading JWT Claims in Resources

Resources can inject the JWT:

```java
@Inject
JsonWebToken jwt;
```
