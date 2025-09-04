import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true // send/receive refresh cookie
});

// access token is held in memory
let inMemoryAccessToken: string | null = null;

export function setAccessToken(t: string | null) {
  inMemoryAccessToken = t;
}

api.interceptors.request.use((config) => {
  if (inMemoryAccessToken) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_BASE}/refresh`,
      {},
      { withCredentials: true }
    );
    const token = data?.accessToken as string | undefined;
    if (token) setAccessToken(token);
    return token ?? null;
  } catch {
    setAccessToken(null);
    return null;
  }
}

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const status = err?.response?.status;
    const original = err?.config;

    if (status === 401 && !original?._retry) {
      original._retry = true;
      refreshing = refreshing ?? doRefresh();
      const token = await refreshing.finally(() => (refreshing = null));
      if (token) {
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${token}`;
        return api.request(original);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
