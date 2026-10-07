// =============================================
// PARKINGS (LOCATIONS) SERVICE — /api/Admin/locations/*
// =============================================

import { api } from './apiClient';

export const parkingsService = {
  /**
   * Returns aggregated statistics for the Parking Locations page
   * GET /api/Admin/locations/stats
   */
  async getStats() {
    return api.get('/api/Admin/locations/stats');
  },

  /**
   * Returns a paginated, filterable, and searchable list of parking locations
   * GET /api/Admin/locations
   */
  async getParkings(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/Admin/locations${query ? `?${query}` : ''}`);
  },

  /**
   * Returns detailed profile information for a specific parking location
   * GET /api/Admin/locations/{parkingId}
   */
  async getParkingDetails(parkingId) {
    return api.get(`/api/Admin/locations/${parkingId}`);
  },

  /**
   * Updates the operational status of a parking location ("Active" or "Inactive")
   * PUT /api/Admin/locations/{parkingId}/status
   */
  async updateLocationStatus(parkingId, statusData) {
    return api.put(`/api/Admin/locations/${parkingId}/status`, statusData);
  }
};
