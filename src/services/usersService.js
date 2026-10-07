import { api } from './apiClient';

export const usersService = {
  /**
   * Returns aggregated count statistics for the Users Management page
   * GET /api/Admin/users/stats
   */
  async getStats() {
    return api.get('/api/Admin/users/stats');
  },

  /**
   * Returns a paginated, filterable, and searchable list of drivers
   * GET /api/Admin/users
   */
  async getUsers(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/Admin/users${query ? `?${query}` : ''}`);
  },

  /**
   * Returns detailed profile information for a specific driver
   * GET /api/Admin/users/{userId}
   */
  async getUserDetails(userId) {
    return api.get(`/api/Admin/users/${userId}`);
  },

  /**
   * Updates the status of a driver account (e.g. suspend or activate)
   * PUT /api/Admin/users/{userId}/status
   */
  async updateUserStatus(userId, statusData) {
    return api.put(`/api/Admin/users/${userId}/status`, statusData);
  }
};
