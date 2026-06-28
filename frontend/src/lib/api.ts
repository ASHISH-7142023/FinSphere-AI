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
    tier?: "free" | "pro" | "elite";
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
    const errorMsg = body.message ?? "Request failed";
    if (response.status === 401 || errorMsg === "Invalid token" || errorMsg.includes("bearer token")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("finsphere.session");
        window.location.reload();
      }
    }
    throw new Error(errorMsg);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
