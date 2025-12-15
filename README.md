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


This README combines the key information from both the frontend and backend READMEs while providing a comprehensive overview of the entire project. It includes:
1. A brief description of the project
2. Key features of both frontend and backend
3. Setup instructions for both parts
4. Project structure
5. Development commands
6. API documentation links
7. Contributing guidelines and license information
