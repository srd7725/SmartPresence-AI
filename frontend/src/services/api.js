// ===========================================
// Centralized Axios API Client
// ===========================================
// Handles: base URL, auth token injection,
// response interception, and token expiry.
// ===========================================

import axios from 'axios';

// Read base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// ---- REQUEST INTERCEPTOR ----
// Automatically injects the JWT Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---- RESPONSE INTERCEPTOR ----
// Handles expired tokens (401) and network errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Successful response — pass through
    return response;
  },
  (error) => {
    // Handle specific error scenarios
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token expired or invalid — clear auth state and redirect
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        // Only redirect if not already on login/register pages
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
      }
    } else if (error.code === 'ECONNABORTED') {
      // Request timed out
      console.error('API request timed out');
    } else if (!error.response) {
      // Network error — backend is likely offline
      console.error('Network error — backend may be offline');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
