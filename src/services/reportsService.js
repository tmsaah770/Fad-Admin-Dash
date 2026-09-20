// =============================================
// REPORTS & ANALYTICS SERVICE — /api/reports/*
// =============================================

import { api } from './apiClient';

export const reportsService = {
  /**
   * Get revenue report data
   * GET /api/reports/revenue
   */
  async getRevenueReport(startDate, endDate) {
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return api.get(`/api/reports/revenue${qs}`);
  },

  /**
   * Download revenue CSV export
   * GET /api/reports/revenue/export
   */
  async exportRevenueCsv(startDate, endDate) {
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return api.get(`/api/reports/revenue/export${qs}`);
  },
};
