const base = 'http://localhost:8080/projects';

// FETCH PROJECTS
export async function fetchProjects() {
  const res = await fetch(`${base}`);
  if (!res.ok) throw new Error('Failed to load projects');
  return res.json();
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
  const res = await fetch(`${base}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create project');
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
  const res = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

// DELETE PROJECT
export async function deleteProject(id: number) {
  const res = await fetch(`${base}/${id}`, { 
    method: 'DELETE' 
  });
  if (!res.ok) throw new Error('Failed to delete project');
}
