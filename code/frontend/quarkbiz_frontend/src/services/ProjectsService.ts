import { API_BASE_URL } from "../config/api";
const base = `${API_BASE_URL}/projects`;

// FETCH PROJECTS
export async function fetchProjects() {
  const res = await fetch(`${base}`);
  if (!res.ok) throw new Error('Failed to load projects');
  const data = await res.json();
  return data;
} 

// CREATE PROJECT
export async function createProject(payload: {
  projName: string;
  projDescription?: string;
  techStackIds: number[];
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate?: string; // yyyy-MM-dd
  endDate?: string;
}) {
  // IMPORTANT: Send status exactly as database ENUM expects
  const res = await fetch(`${base}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to create project' }));
    throw new Error(error.message || 'Failed to create project');
  }
  return res.json();
}

// UPDATE PROJECT
export async function updateProject(id: number, payload: { 
  projName: string;
  projDescription?: string;
  techStackIds: number[];
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate?: string; // yyyy-MM-dd
  endDate?: string;
}) {
  // IMPORTANT: Send status exactly as database ENUM expects
  const res = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to update project' }));
    throw new Error(error.message || 'Failed to update project');
  }
  return res.json();
}

// DELETE PROJECT
export async function deleteProject(id: number) {
  const res = await fetch(`${base}/${id}`, { 
    method: 'DELETE' 
  });
  if (!res.ok) throw new Error('Failed to delete project');
}
