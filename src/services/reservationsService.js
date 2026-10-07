// =============================================
// RESERVATIONS SERVICE — /api/Admin/reservations/*
// =============================================

import { api } from './apiClient';

export const reservationsService = {
  /**
   * Returns aggregated statistics for the Reservations page
   * GET /api/Admin/reservations/stats
   */
  async getStats() {
    return api.get('/api/Admin/reservations/stats');
  },

  /**
   * Returns a paginated, filterable, and searchable list of platform-wide bookings
   * GET /api/Admin/reservations
   */
  async getReservations(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/Admin/reservations${query ? `?${query}` : ''}`);
  },

  /**
   * Returns detailed information for a specific platform booking
   * GET /api/Admin/reservations/{reservationId}
   */
  async getReservationById(reservationId) {
    return api.get(`/api/Admin/reservations/${reservationId}`);
  },

  /**
   * Cancels a booking on behalf of the customer or platform administrator
   * PUT /api/Admin/reservations/{reservationId}/cancel
   */
  async cancelReservation(reservationId, cancelData) {
    return api.put(`/api/Admin/reservations/${reservationId}/cancel`, cancelData);
  }
};
