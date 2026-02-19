import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

// Main axios instance
const api = axios.create({ baseURL: BASE_URL });

// Attach access token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────
export const authAPI = {
  register: (data) => axios.post(`${BASE_URL}/api/auth/register`, data),
  login:    (data) => axios.post(`${BASE_URL}/api/auth/login`, data),
  refresh:  (refreshToken) => axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken }),
  logout:   (refreshToken) => axios.post(`${BASE_URL}/api/auth/logout`, { refreshToken }),
  me:       () => api.get('/api/auth/me'),
};

// ── Users CRUD ────────────────────────────────────
export const usersAPI = {
  getAll:  ()         => api.get('/api/users'),
  getOne:  (id)       => api.get(`/api/users/${id}`),
  create:  (data)     => api.post('/api/users', data),
  update:  (id, data) => api.put(`/api/users/${id}`, data),
  delete:  (id)       => api.delete(`/api/users/${id}`),
};

export default api;
