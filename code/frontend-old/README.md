# React + TypeScript + Vite

# 🦆 **QuarkBiz Frontend — React TypeScript Application**

This repository contains the frontend for the 🦆🦆🦆 **QuarkBiz** 🦆🦆🦆 built with **React 18**, **TypeScript**, and **Vite**, following modern React patterns and best practices.

The frontend provides a responsive UI for:

* **TechStack Categories** management
* **TechStacks** management
* **Projects** management

---

# 🏗️ **Architecture Overview**

### ✔ Component-Based Architecture

```
Pages         →  Top-level route components
Components    →  Reusable UI components
Hooks         →  Custom React hooks
Services      →  API clients and data fetching
Store         →  State management
Types         →  TypeScript type definitions
Utils         →  Helper functions and utilities
```

### ✔ Main Technologies

| Feature        | Stack                      |
| -------------- | -------------------------- |
| Framework      | **React 18**               |
| Build Tool     | Vite                       |
| Language       | TypeScript                 |
| Styling        | Tailwind CSS               |
| State Management| React Context / Redux      |
| HTTP Client    | Axios / Fetch API          |
| Form Handling  | React Hook Form            |
| Routing        | React Router               |
| Testing        | Jest + React Testing Library|

---

# 📁 **Project Structure**

```
src/
│
├── components/     ← Reusable UI components
├── pages/          ← Page components (routes)
├── hooks/          ← Custom React hooks
├── services/       ← API clients and services
├── store/          ← State management
├── types/          ← TypeScript type definitions
├── utils/          ← Utility functions
└── styles/         ← Global styles and themes
```

---

# 🔥 **Key Features**

### ✔ Modern React Patterns

- Functional components with hooks
- Type-safe with TypeScript
- Component composition
- Custom hooks for logic reuse

### ✔ Responsive Design

- Mobile-first approach
- Responsive layouts with Tailwind CSS
- Accessible components

### ✔ State Management

- Context API for global state
- Optimized re-renders
- Persisted state where needed

### ✔ API Integration

- Type-safe API clients
- Error handling
- Loading states
- Request/response interceptors

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
