import { API_BASE_URL } from "../config/api";
const base = `${API_BASE_URL}/techstack`;

export async function fetchTechStacks() {
  const res = await fetch(`${base}`);
  if (!res.ok) throw new Error('Failed to load tech stacks');
  return res.json();
}

export async function fetchTechStackById(id: number) {
  const res = await fetch(`${base}/${id}`);
  if (!res.ok) throw new Error('Failed to load category');
  return res.json();
}

export async function createTechStack(
    payload: {
    tsName: string;
    tsDescription?: string;
    categoryId: number;
    }
) {
  const res = await fetch(`${base}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create tech stack');
  return res.json();
}

// UPDATE TECH STACK
export async function updateTechStack(id: number, payload: { 
  tsName: string; 
  tsDescription?: string; 
  categoryId: number
}) {
  const res = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update tech stack');
  return res.json();
}

// DELETE TECH STACK
export async function deleteTechStack(id: number) {
  const res = await fetch(`${base}/${id}`, { 
    method: 'DELETE' 
  });
  if (!res.ok) throw new Error('Failed to delete tech stack');
}

