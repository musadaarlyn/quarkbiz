# backend

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: <https://quarkus.io/>.

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./mvnw quarkus:dev
```

# 🦆 **QuarkusBiz Backend — Quarkus 3 REST API**

This repository contains the backend API for the 🦆🦆🦆 **QuarkusBiz** 🦆🦆🦆 built with **Quarkus 3**, following a clean, layered architecture using REST, DTOs, Panache ORM, and MySQL.

The backend exposes CRUD and search endpoints for:

* **TechStack Categories**
* **TechStacks**
* **Projects**

---

# 🏗️ **Architecture Overview**

### ✔ Layered Architecture

```
Resource Layer     →  HTTP / REST (JAX-RS)
Service Layer      →  Business logic + validation
Mapper Layer       →  Entity ↔ DTO conversion
Entity Layer       →  Panache ORM / Database
DTO Layer          →  Input/Output models for REST
Exception Layer    →  Global error handling
```

### ✔ Main Technologies

| Feature        | Stack                      |
| -------------- | -------------------------- |
| Runtime        | **Quarkus 3**              |
| REST Framework | JAX-RS (RESTEasy Classic)  |
| JSON           | Jackson                    |
| ORM            | Hibernate ORM with Panache |
| DB             | MySQL                      |
| Validation     | Jakarta Bean Validation    |
| Documentation  | OpenAPI / Swagger          |
| Build          | Maven                      |

---

# 📁 **Project Structure**

```
src/main/java/com/codebiz
│
├── resource/        ← REST endpoints (JAX-RS)
├── service/         ← Business logic & validation
├── mapper/          ← DTO ↔ Entity transformers
├── dto/             ← Request & Response models
├── model/           ← Panache entities (DB models)
└── exception/       ← Global exception handler
```

---

# 🔥 **Key Features**

### ✔ CRUD APIs

Full create, read, update, delete operations for:

* TechStack Categories
* TechStacks (with category reference)
* Projects (with techStack IDs list)

---

### ✔ Search + Filters + Sorting + Pagination

All major modules support:

```
?name=
?status=
?sort=
?direction=asc/desc
?page=0
&size=10
```

---

### ✔ DTO-Based Design

Entities never expose themselves directly to clients.
All requests & responses use DTOs.

---

### ✔ Validation

Handled via Jakarta Bean Validation (`@NotBlank`, `@Size`, `@NotNull`, etc).

---

### ✔ Exception Handling

A **GlobalExceptionMapper** unifies error responses:

```json
{
  "status": 400,
  "message": "Field is required",
  "timestamp": 1733123123123
}
```

---

### ✔ Transaction-safe

All writes (`create`, `update`, `delete`) use:

```java
@Transactional
```

---

# ⚙️ **Configuration**

Located in `src/main/resources/application.properties`.

Includes:

* MySQL config
* CORS config
* SQL logging
* Hibernate settings

---

# ▶️ **Run the Backend**

### **1. Install Dependencies**

```
mvn install
```

### **2. Start Quarkus Dev Mode**

```
mvn quarkus:dev
```

### **3. Open Swagger UI**

```
http://localhost:8080/q/swagger-ui
```

---

# 🧪 **Testing the API**

Example: Create a TechStack

```json
POST /techstack
{
  "tsName": "React",
  "tsDescription": "Frontend JS library",
  "categoryId": 1
}
```

Example: Create a Project

```json
POST /projects
{
  "projName": "Portfolio Website",
  "projDescription": "My personal portfolio",
  "techStackIds": [1, 2, 4],
  "status": "ACTIVE",
  "startDate": "2024-10-01",
  "endDate": "2025-01-15"
}
```

---

# 🚨 **Current Limitations / To-Do List**

## ❌ 1. **GlobalExceptionMapper not fully refined**

Currently it catches all exceptions as 500.
I planned to fix this but I decided not to proceed (which is fine).
REST semantics may be inaccurate for some errors.

## ❌ 2. **Database password in the source code**

`application.properties` contains plain DB credentials.
Needs migration to environment variables.

## ❌ 3. **techStackIds stored as JSON string (not relational)**

Projects store tech stack IDs as a single string column.
This limits:

* joins
* referential integrity
* relational querying

**Future improvement:** replace with `@ManyToMany` or join table.

## ❌ 4. **Missing Unit/Integration Tests**

QuarkusTest 🦆🦆🦆 is not yet implemented.

## ❌ 5. **No Authentication**

API is currently open.

## ❌ 6. **Missing Business Rule Validation**

Examples of things not yet validated:

* Project `startDate` < `endDate`
* No duplicate techStackIds
* Category cannot be deleted if stacks exist
* Project status enum type

# 📌 **Future Enhancements (Recommended)**

* ✔ Add full relationship mapping (Projects ↔ TechStacks)
* ✔ Implement caching for static lookups (categories)
* ✔ Add pagination wrappers (`PagedResponse<T>`)
* ✔ Add OpenAPI descriptions to endpoints
* ✔ Add error-code system (e.g., ERR001)
* ✔ Add CI/CD pipeline (GitHub Actions)
* ✔ Add production profile configuration

---

# 🎉 **Summary**

I now have:

* A clean, enterprise-style Quarkus backend
* Full CRUD + search on all modules
* DTO architecture with mapping
* Database persistence via Panache ORM
* Centralized validation
* A polished README for the repo
* A clear understanding of missing pieces


