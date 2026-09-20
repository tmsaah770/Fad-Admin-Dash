// =============================================
// PARKINGS (LOCATIONS) SERVICE — /api/Parkings/*
// =============================================

import { api } from './apiClient';

export const parkingsService = {
  /**
   * Get all parking facilities
   * GET /api/Parkings
   */
  async getParkings() {
    return api.get('/api/Parkings');
  },

  /**
   * Get parking details by ID
   * GET /api/Parkings/{id}/details
   */
  async getParkingDetails(id) {
    return api.get(`/api/Parkings/${id}/details`);
  },

  /**
   * Get available spaces count
   * GET /api/Parkings/{id}/available
   */
  async getAvailableSpaces(id) {
    return api.get(`/api/Parkings/${id}/available`);
  },

  /**
   * Search parkings
   * GET /api/Parkings/search?query=...
   */
  async searchParkings(query) {
    return api.get(`/api/Parkings/search?query=${encodeURIComponent(query)}`);
  },

  /**
   * Create a new parking facility
   * POST /api/Parkings
   */
  async createParking(data) {
    return api.post('/api/Parkings', data);
  },

  /**
   * Update parking facility
   * PUT /api/Parkings/{id}
   */
  async updateParking(id, data) {
    return api.put(`/api/Parkings/${id}`, data);
  },

  /**
   * Delete parking facility
   * DELETE /api/Parkings/{id}
   */
  async deleteParking(id) {
    return api.del(`/api/Parkings/${id}`);
  },
};
