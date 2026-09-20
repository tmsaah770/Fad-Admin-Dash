// =============================================
// PARKLY API CLIENT
// Base URL: https://parkly-backend.up.railway.app
// =============================================

// In dev, empty base URL routes through Vite reverse proxy to avoid CORS preflight blocks
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://parkly-backend.up.railway.app' : '');

/**
 * Core fetch wrapper with automatic JWT authorization and error handling
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('parkly_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle CSV or binary blob download
    const contentType = response.headers.get('content-type');
    if (contentType && (contentType.includes('csv') || contentType.includes('octet-stream'))) {
      return response.blob();
    }

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/api/auth/login')) {
        localStorage.removeItem('parkly_token');
        localStorage.removeItem('parkly_user');
        window.location.href = '/login';
      }
      const error = new Error(json?.message || `HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.data = json;
      throw error;
    }

    return json;
  } catch (err) {
    console.warn(`[Parkly API] Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  get: (endpoint, options) => apiFetch(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) =>
    apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) =>
    apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (endpoint, body, options) =>
    apiFetch(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  del: (endpoint, options) => apiFetch(endpoint, { method: 'DELETE', ...options }),
};
