
import axios from "axios";

// Allow VITE_API_URL to be either "http://localhost:3000" or ".../api/v1"
function normalizeBase(url?: string) {
  const raw = (url || "http://localhost:3000").replace(/\/+$/, "");
  return raw.endsWith("/api/v1") ? raw : `${raw}/api/v1`;
}

const API_URL = normalizeBase(import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// --- Auth header + refresh handling ---
let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err ?? {};
    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      if (!refreshing) {
        refreshing = true;
        try {
          const { data } = await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          if (data?.accessToken) {
            localStorage.setItem("access_token", data.accessToken);
          }
          queue.forEach((fn) => fn());
          queue = [];
          return api(config);
        } catch (e) {
          localStorage.removeItem("access_token");
          window.location.href = "/signin";
          throw e;
        } finally {
          refreshing = false;
        }
      }
      return new Promise((resolve) => {
        queue.push(() => resolve(api(config)));
      });
    }
    throw err;
  }
);

// --- API wrappers ---
export const signUp = (email: string, password: string) =>
  api.post("/auth/signup", { email, password });

export const signIn = (email: string, password: string) =>
  api.post("/auth/signin", { email, password });

// Backend route is /auth/logout
export const signOut = () => api.post("/auth/logout");

// Content
export const listContent = () => api.get("/content");
export const createContent = (payload: any) => api.post("/content", payload);
export const deleteContent = (id: string) => api.delete(`/content/${id}`);

// Share
export const enableShare = async () => {
  const { data } = await api.post("/share");
  return data as { slug: string; url: string };
};

export const disableShare = async () => {
  const { data } = await api.delete("/share");
  return data as { ok: true };
};

export const fetchShared = async (slug: string) => {
  const { data } = await api.get(`/share/${encodeURIComponent(slug)}`);
  // Return as-is; ShareView will handle {items: [...] } or just [...]
  return data;
};
