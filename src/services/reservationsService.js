// =============================================
// RESERVATIONS SERVICE — /api/Reservations/*
// =============================================

import { api } from './apiClient';

export const reservationsService = {
  /**
   * Get owner reservations
   * GET /api/Reservations/owner
   */
  async getReservations() {
    return api.get('/api/Reservations/owner');
  },

  /**
   * Get active reservations
   * GET /api/Reservations/my-reservations/active
   */
  async getActiveReservations() {
    return api.get('/api/Reservations/my-reservations/active');
  },

  /**
   * Get reservation by id
   * GET /api/Reservations/{id}
   */
  async getReservationById(id) {
    return api.get(`/api/Reservations/${id}`);
  },

  /**
   * Create a reservation
   * POST /api/Reservations
   */
  async createReservation(data) {
    return api.post('/api/Reservations', data);
  },

  /**
   * Cancel/delete reservation
   * DELETE /api/Reservations/{id}
   */
  async cancelReservation(id) {
    return api.del(`/api/Reservations/${id}`);
  },
};
