// =============================================
// DASHBOARD SERVICE — /api/Dashboard/*
// =============================================

import { api } from './apiClient';

export const dashboardService = {
  /**
   * Aggregated summary (occupancy, total spaces, bookings count, today revenue)
   * GET /api/Dashboard/summary
   */
  async getSummary() {
    return api.get('/api/Dashboard/summary');
  },

  /**
   * Revenue chart data
   * GET /api/Dashboard/revenue?period=monthly
   */
  async getRevenue(period = 'monthly') {
    return api.get(`/api/Dashboard/revenue?period=${period}`);
  },

  /**
   * Locations summary for dashboard
   * GET /api/Dashboard/locations
   */
  async getLocations() {
    return api.get('/api/Dashboard/locations');
  },

  /**
   * Today's reservations
   * GET /api/Dashboard/reservations/today
   */
  async getTodayReservations() {
    return api.get('/api/Dashboard/reservations/today');
  },

  /**
   * Recent activity feed
   * GET /api/Dashboard/activity
   */
  async getActivity() {
    return api.get('/api/Dashboard/activity');
  },
};
