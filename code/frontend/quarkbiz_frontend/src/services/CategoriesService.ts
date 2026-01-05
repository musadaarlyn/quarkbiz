import { API_BASE_URL } from "../config/api";
const base = `${API_BASE_URL}/categories`;

// HANDLE RESPONSE
async function handleResponse(res: Response) {
  if (res.ok) return res;
  const data = await res.json().catch(() => ({}));
  const message = data?.message ?? "Something went wrong";
  throw new Error(message);
}

// FETCH CATEGORIES
export async function fetchCategories() {
  const res = await fetch(`${base}`);
  await handleResponse(res);
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
  await handleResponse(res);
  return res.json();
}

// UPDATE CATEGORY
export async function updateCategory(id: number, payload: { tscName: string; tscDescription?: string }) {
  const res = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  await handleResponse(res);
  return res.json();
}

// DELETE CATEGORY
export async function deleteCategory(id: number) {
  const res = await fetch(`${base}/${id}`, { 
    method: 'DELETE' 
  });
  await handleResponse(res);
}
