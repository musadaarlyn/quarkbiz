const base = 'http://localhost:8080';

// FETCH PROJECTS
export async function fetchProjects() {
  const res = await fetch(`${base}/projects`);
  if (!res.ok) throw new Error('Failed to load projects');
  return res.json();
}

export async function createProject(payload: {
  projName: string;
  projDescription?: string;
  techStackIds: number[];
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate?: string; // yyyy-MM-dd
  endDate?: string;
}) {
  const res = await fetch(`${base}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}