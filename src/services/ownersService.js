import { api } from './apiClient';

export const ownersService = {
  /**
   * Returns aggregated statistics for the Parking Owners page
   * GET /api/Admin/owners/stats
   */
  async getStats() {
    return api.get('/api/Admin/owners/stats');
  },

  /**
   * Returns a paginated, filterable, and searchable list of parking owners
   * GET /api/Admin/owners
   */
  async getOwners(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/Admin/owners${query ? `?${query}` : ''}`);
  },

  /**
   * Returns detailed profile information for a specific parking owner
   * GET /api/Admin/owners/{ownerId}
   */
  async getOwnerDetails(ownerId) {
    return api.get(`/api/Admin/owners/${ownerId}`);
  },

  /**
   * Updates the verification status of a parking owner
   * PUT /api/Admin/owners/{ownerId}/status
   */
  async updateOwnerStatus(ownerId, statusData) {
    return api.put(`/api/Admin/owners/${ownerId}/status`, statusData);
  }
};
