import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
});

// Store the latest access token
let refreshing = false;
let queue: Array<() => void> = [];

// Attach Authorization if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh on 401, retry once
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err;
    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      if (!refreshing) {
        refreshing = true;
        try {
          const { data } = await axios.post('http://localhost:3000/api/v1/auth/refresh', {}, { withCredentials: true });
          localStorage.setItem('access_token', data.accessToken);
          queue.forEach((fn) => fn());
          queue = [];
          return api(config);
        } catch (e) {
          localStorage.removeItem('access_token');
          window.location.href = '/signin';
          return Promise.reject(e);
        } finally {
          refreshing = false;
        }
      }
      // wait until refresh done, then retry
      return new Promise((resolve) => {
        queue.push(() => resolve(api(config)));
      });
    }
    return Promise.reject(err);
  }
);

// Convenience wrappers
export const signUp = (email: string, password: string) => api.post('/auth/signup', { email, password });
export const signIn = (email: string, password: string) => api.post('/auth/signin', { email, password });
export const signOut = () => api.post('/auth/signout');
export const listContent = () => api.get('/content');
export const createContent = (payload: any) => api.post('/content', payload);
export const deleteContent = (id: string) => api.delete(`/content/${id}`);
