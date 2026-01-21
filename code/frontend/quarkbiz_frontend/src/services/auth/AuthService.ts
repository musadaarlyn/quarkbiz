import { API_BASE_URL } from "../../config/api";
const base = `${API_BASE_URL}/auth`;

export async function login(payload: { username: string; password: string }): Promise<string> {
  const res = await fetch(`${base}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Login failed" }));
    throw new Error(error.message || "Login failed");
  }

  const data = await res.json();
  return data.accessToken;
}

export async function refresh(): Promise<string> {
  const res = await fetch(`${base}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  return data.accessToken;
}


