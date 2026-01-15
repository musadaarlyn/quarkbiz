import { API_BASE_URL } from "../../config/api";
const base = `${API_BASE_URL}/auth`;

export async function login(payload: { username: string; password: string }): Promise<string> {
  const res = await fetch(`${base}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Login failed" }));
    throw new Error(error.message || "Login failed");
  }

  const data = await res.json();
  return data.token;
}

