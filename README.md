# 🦆 QuarkBiz - Full Stack Application

A modern full-stack application for managing TechStack Categories, TechStacks, and Projects, built with Quarkus 3 and React 18.

## 🌟 Features

### Backend (Quarkus 3)
- **RESTful API** with JAX-RS
- **MySQL Database** with Hibernate ORM and Panache
- **CRUD Operations** for all major entities
- **Search, Filtering, Sorting, and Pagination**
- **DTO-based design** for clean API contracts
- **Input Validation** with Jakarta Bean Validation
- **OpenAPI/Swagger** documentation

### Frontend (React 18 + TypeScript)
- **Modern React** with Hooks
- **Type-Safe** with TypeScript
- **Responsive UI** with Tailwind CSS
- **State Management** with React Context/Redux
- **Form Handling** with React Hook Form
- **Client-Side Routing** with React Router

## 📂 Project Structure

```
code/
├── backend/        # Quarkus 3 backend
│   ├── src/main/java/com/codebiz
│   │   ├── resource/    # REST endpoints
│   │   ├── service/     # Business logic
│   │   ├── mapper/      # DTO transformations
│   │   └── model/       # Database entities
│   └── ...
│
└── frontend/       # React 18 frontend
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── hooks/       # Custom hooks
    │   └── services/    # API clients
    └── ...
```

**frontend & backend have separate README**
