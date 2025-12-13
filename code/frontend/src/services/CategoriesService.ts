const base = 'http://localhost:8080/categories';

// FETCH CATEGORIES
export async function fetchCategories() {
  const res = await fetch(`${base}`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function fetchCategoryById(id: number) {
  const res = await fetch(`${base}/${id}`);
  if (!res.ok) throw new Error('Failed to load category');
  return res.json();
}

// CREATE CATEGORY
export async function createCategory(payload: { tscName: string; tscDescription?: string }) {
  const res = await fetch(`${base}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

// UPDATE CATEGORY
export async function updateCategory(id: number, payload: { tscName: string; tscDescription?: string }) {
  const res = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
}

// DELETE CATEGORY
export async function deleteCategory(id: number) {
  const res = await fetch(`${base}/${id}`, { 
    method: 'DELETE' 
  });
  if (!res.ok) throw new Error('Failed to delete category');
}
