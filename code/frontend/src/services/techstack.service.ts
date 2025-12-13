const base = 'http://localhost:8080';

export async function fetchTechStacks() {
  const res = await fetch(`${base}/techstack`);
  if (!res.ok) throw new Error('Failed to load tech stacks');
  return res.json();
}

export async function createTechStack(
    payload: {
    tsName: string;
    tsDescription?: string;
    categoryId: number;
    }
) {
  const res = await fetch(`${base}/techstack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create tech stack');
  return res.json();
}