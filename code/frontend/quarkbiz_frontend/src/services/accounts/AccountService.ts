import { API_BASE_URL } from "../../config/api";
const base = `${API_BASE_URL}/users`;

// CREATE PROJECT
export async function createAccount(payload: {
  username: string; 
  password: string;
  displayName: string;
}) {
  const res = await fetch(`${base}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to create account' }));
    throw new Error(error.message || 'Failed to create project');
  }
  return res.json();
}