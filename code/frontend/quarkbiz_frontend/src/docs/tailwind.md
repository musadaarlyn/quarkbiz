# Project UI Refactor Documentation

## What We Did

- All **Tailwind utility classes were replaced with semantic class names**, e.g., `create-project-page`, `view-project-card`, `list-projects-card`, etc.
- TSX now contains **purely semantic markup** without inline styling clutter.

---

### 2. Component Cleanup

- Removed redundant Tailwind clutter in TSX.
- Added **semantic class names** to all major blocks:
  - Forms, inputs, labels, buttons, cards, grids.
- Example:

**Before**

```tsx
<div className="p-4 font-sans flex flex-col md:flex-row ">
```

**After**

```tsx
<div className="list-projects">
```

### TL;DR

We refactored all major feature pages to:

- Move inline Tailwind into **feature-scoped CSS files**
- Use **semantic class names** in TSX
- Keep **responsive, hover, selected states**
- Keep **project ready for enterprise scaling** with reusable UI primitives

---

## Next Steps

1. **Extract shared UI primitives** (Card, Button, Input) across all pages.
2. **Consolidate common Project styles** (ListProjects, ViewProjectCard, CreateProject) to reduce duplication.
3. **Introduce a design token system** for colors, spacing, fonts.
4. **Add Storybook for visual documentation** of all reusable components.
5. **Integrate CSS Modules / Tailwind JIT fully** to ensure enterprise-grade styling.

---
