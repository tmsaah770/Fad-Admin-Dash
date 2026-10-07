// =============================================
// REPORTS & ANALYTICS SERVICE — /api/Admin/analytics
// =============================================

import { api } from './apiClient';

export const reportsService = {
  /**
   * Returns platform-wide reports and analytics
   * GET /api/Admin/analytics
   */
  async getAnalytics(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/Admin/analytics${query ? `?${query}` : ''}`);
  },

  /**
   * Exports platform-wide analytics and owner revenue breakdown as a CSV
   * GET /api/Admin/analytics/export
   */
  async exportAnalyticsCsv(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/Admin/analytics/export${query ? `?${query}` : ''}`);
  }
};
