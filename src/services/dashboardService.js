// =============================================
// DASHBOARD SERVICE — /api/Admin/dashboard/*
// =============================================

import { api } from './apiClient';

export const dashboardService = {
  /**
   * Aggregated summary (platform-wide)
   * GET /api/Admin/dashboard/summary
   */
  async getSummary() {
    return api.get('/api/Admin/dashboard/summary');
  },

  /**
   * Revenue chart data
   * GET /api/Admin/dashboard/revenue
   */
  async getRevenue(period = 'monthly') {
    return api.get(`/api/Admin/dashboard/revenue?period=${period}`);
  },

  /**
   * Bookings chart data
   * GET /api/Admin/dashboard/bookings-chart
   */
  async getBookingsChart(period = 'monthly') {
    return api.get(`/api/Admin/dashboard/bookings-chart?period=${period}`);
  },

  /**
   * Recent activity feed (platform-wide)
   * GET /api/Admin/dashboard/activity
   */
  async getActivity() {
    return api.get('/api/Admin/dashboard/activity');
  },

  /**
   * Pending approvals
   * GET /api/Admin/dashboard/pending-approvals
   */
  async getPendingApprovals(page = 1, pageSize = 10) {
    return api.get(`/api/Admin/dashboard/pending-approvals?page=${page}&pageSize=${pageSize}`);
  },

  /**
   * Approves or rejects a pending parking owner
   * PUT /api/Admin/dashboard/approvals/{ownerId}
   */
  async updateApproval(ownerId, statusData) {
    return api.put(`/api/Admin/dashboard/approvals/${ownerId}`, statusData);
  }
};
