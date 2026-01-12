# Frontend Auth + JWT Handling (QuarkBiz Frontend)

This document explains how the frontend handles authentication using a JWT issued by the backend. It covers:

- how login works
- where the token is stored
- how secured API requests attach the token
- how logout should work
- common pitfalls and how to debug them

---

## Overview

- The backend issues a JWT via `POST /auth/login`.
- The frontend stores the JWT under `localStorage["jwtToken"]`.
- All secured API calls include the header:
  - `Authorization: Bearer <token>`
- The auth state is exposed via a React context (`AuthContext`).

---

## Files Involved

- **[src/context/AuthContext.tsx](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/frontend/quarkbiz_frontend/src/context/AuthContext.tsx:0:0-0:0)**
  - Stores the current token and authentication state.
  - Syncs token to/from localStorage key `jwtToken`.
- **[src/services/auth/AuthService.ts](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/frontend/quarkbiz_frontend/src/services/auth/AuthService.ts:0:0-0:0)**
  - Calls the backend login endpoint and returns the JWT.
- **[src/pages/Login.tsx](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/frontend/quarkbiz_frontend/src/pages/Login.tsx:0:0-0:0)**
  - Login UI; calls AuthService login; saves token; redirects after login.
- **[src/services/projects/ProjectsService.ts](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/frontend/quarkbiz_frontend/src/services/projects/ProjectsService.ts:0:0-0:0)**
  - Example of attaching JWT to requests using an [authHeaders()](cci:1://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/frontend/quarkbiz_frontend/src/services/projects/ProjectsService.ts:3:0-10:1) helper.
- **[src/config/api.ts](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/frontend/quarkbiz_frontend/src/config/api.ts:0:0-0:0)**
  - Reads `VITE_API_BASE_URL` (backend base URL).

---

## Environment / API Base URL

File: [src/config/api.ts](cci:7://file:///c:/Users/Arlyn%20Musada/Documents/Practice_Projects/quarkbiz/code/frontend/quarkbiz_frontend/src/config/api.ts:0:0-0:0)

```ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```
