/**
 * services/api.js
 * One shared axios instance for every API call.
 *
 * Request interceptor  → automatically attaches the JWT from localStorage
 *                        as "Authorization: Bearer <token>".
 * Response interceptor → if the token expires (401), clears the session
 *                        and redirects to the login page.
 */
import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired / invalid sessions globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/');
    const onAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');

    if (status === 401 && !isAuthEndpoint && !onAuthPage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
