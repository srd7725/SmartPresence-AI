// ===========================================
// Auth Service — API calls for authentication
// ===========================================
// Encapsulates all auth-related API communication.
// Uses the centralized apiClient for consistency.
// ===========================================

import apiClient from './api';

/**
 * Register a new user
 * POST /auth/register
 * @param {Object} userData - { full_name, email, role, enrollment_number, department, password }
 */
export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

/**
 * Login user with email and password
 * POST /auth/login
 * FastAPI expects OAuth2PasswordRequestForm → x-www-form-urlencoded
 * The "username" field is used for email (OAuth2 convention)
 */
export const loginUser = async (email, password) => {
  // Build URL-encoded form data (required by FastAPI's OAuth2PasswordRequestForm)
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

/**
 * Get current authenticated user profile
 * GET /auth/me
 * Requires valid Bearer token (injected by apiClient interceptor)
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};
