import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const api = axios.create({
  baseURL: apiBase + "/api/v1",
  withCredentials: true
});

// ---- auth token plumbing (localStorage) ----
export function getToken(): string | null {
  return localStorage.getItem("access_token");
}
export function setToken(t: string) {
  localStorage.setItem("access_token", t);
}
export function clearToken() {
  localStorage.removeItem("access_token");
}

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Optional refresh flow (if backend exposes /auth/refresh)
let refreshing = false;
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    if (err?.response?.status !== 401) throw err;
    if (refreshing) throw err;
    try {
      refreshing = true;
      const { data } = await axios.post(apiBase + "/api/v1/auth/refresh", {}, { withCredentials: true });
      if (data?.accessToken) {
        setToken(data.accessToken);
        err.config.headers.Authorization = `Bearer ${data.accessToken}`;
        refreshing = false;
        return api.request(err.config);
      }
    } catch (e) {
      // fall through
    } finally {
      refreshing = false;
    }
    clearToken();
    throw err;
  }
);

// ---- endpoints ----
export async function signIn(email: string, password: string) {
  const { data } = await api.post("/signin", { email, password });
  if (data?.accessToken) setToken(data.accessToken);
  return data;
}
export async function signUp(email: string, password: string) {
  const { data } = await api.post("/signup", { email, password });
  if (data?.accessToken) setToken(data.accessToken);
  return data;
}
export async function signOut() {
  try { await api.post("/signout"); } catch {}
  clearToken();
}

export async function listContent(params?: { kind?: string; tag?: string }) {
  const { data } = await api.get("/content", { params });
  return data;
}
export async function createContent(form: FormData) {
  const { data } = await api.post("/content", form, { headers: { "Content-Type": "multipart/form-data" } });
  return data;
}
export async function deleteContent(id: string) {
  const { data } = await api.delete(`/content/${id}`);
  return data;
}
export async function shareContent(id: string) {
  const { data } = await api.post(`/content/${id}/share`);
  return data as { url: string };
}
export async function shareDashboard() {
  const { data } = await api.post(`/share/dashboard`);
  return data as { url: string };
}
export async function fetchShared(slug: string) {
  const { data } = await api.get(`/share/${slug}`);
  return data;
}
