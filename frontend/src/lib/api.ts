const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export interface Session {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    monthlyIncome: number;
    createdAt: string;
    upiId?: string;
    upiQr?: string;
  };
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: "Request failed" }));
    const errMsg = body.message ?? "Request failed";
    if (errMsg === "Invalid token" || errMsg === "Missing bearer token") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("finsphere.session");
        window.location.href = "/login";
      }
    }
    throw new Error(errMsg);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
