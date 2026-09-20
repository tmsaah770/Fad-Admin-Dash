// =============================================
// AUTH SERVICE — /api/auth/*
// =============================================

import { api } from './apiClient';

export const authService = {
  /**
   * Log in user with email & password
   * POST /api/auth/login
   */
  async login(credentials) {
    const res = await api.post('/api/auth/login', credentials);
    if (res?.data?.token) {
      localStorage.setItem('parkly_token', res.data.token);
      localStorage.setItem('parkly_user', JSON.stringify(res.data));
    }
    return res;
  },

  /**
   * Log out current user
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await api.post('/api/auth/logout', {});
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('parkly_token');
      localStorage.removeItem('parkly_user');
    }
  },

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  async getProfile() {
    return api.get('/api/auth/profile');
  },

  /**
   * Update current user profile
   * PUT /api/auth/profile
   */
  async updateProfile(data) {
    return api.put('/api/auth/profile', data);
  },

  /**
   * Update password
   * PUT /api/auth/settings/security/password
   */
  async updatePassword(passwordData) {
    return api.put('/api/auth/settings/security/password', passwordData);
  },

  /**
   * Get user settings
   * GET /api/auth/settings
   */
  async getSettings() {
    return api.get('/api/auth/settings');
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    return Boolean(localStorage.getItem('parkly_token'));
  },

  /**
   * Get saved user profile from storage
   */
  getCurrentUser() {
    const user = localStorage.getItem('parkly_user');
    return user ? JSON.parse(user) : null;
  },
};
