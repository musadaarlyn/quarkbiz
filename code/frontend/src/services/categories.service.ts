const base = 'http://localhost:8080';

// FETCH CATEGORIES
export async function fetchCategories() {
  const res = await fetch(`${base}/categories`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

// CREATE CATEGORY
export async function createCategory(payload: { tscName: string; tscDescription?: string }) {
  const res = await fetch(`${base}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

// UPDATE CATEGORY
export async function updateCategory(id: number, payload: { tscName: string; tscDescription?: string }) {
  const res = await fetch(`${base}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
}

// DELETE CATEGORY
export async function deleteCategory(id: number) {
  const res = await fetch(`${base}/categories/${id}`, { 
    method: 'DELETE' 
  });
  if (!res.ok) throw new Error('Failed to delete category');
}