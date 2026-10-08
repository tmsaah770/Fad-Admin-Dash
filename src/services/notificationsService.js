// =============================================
// NOTIFICATIONS SERVICE — /api/Notifications/*
// =============================================

import { api } from './apiClient';

export const notificationsService = {
  /**
   * Get paginated notifications
   * GET /api/Notifications?pageNumber=1&pageSize=20
   */
  async getNotifications(page = 1, pageSize = 20) {
    return api.get(`/api/Notifications?page=${page}&pageSize=${pageSize}`);
  },

  /**
   * Get unread notifications summary
   * GET /api/Notifications/summary
   */
  async getSummary() {
    return api.get('/api/Notifications/summary');
  },

  /**
   * Mark a single notification as read
   * PATCH /api/Notifications/{id}/read
   */
  async markAsRead(id) {
    return api.patch(`/api/Notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   * PATCH /api/Notifications/read-all
   */
  async markAllAsRead() {
    return api.patch('/api/Notifications/read-all');
  },
};
