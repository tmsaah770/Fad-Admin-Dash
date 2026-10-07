// =============================================
// PARKLY API CLIENT
// Base URL: https://parkly-backend.up.railway.app
// =============================================

// In dev, empty base URL routes through Vite reverse proxy to avoid CORS preflight blocks
// In prod, it routes through Vercel rewrites proxy.
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

let isRefreshing = false;
let refreshPromise = null;

/**
 * Core fetch wrapper with automatic JWT authorization and error handling
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  let token = localStorage.getItem('parkly_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle CSV or binary blob download
    const contentType = response.headers.get('content-type');
    if (contentType && (contentType.includes('csv') || contentType.includes('octet-stream'))) {
      return response.blob();
    }

    let json = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/api/auth/login') && !endpoint.includes('/api/auth/refresh-token')) {
        const refreshToken = localStorage.getItem('parkly_refreshToken');
        
        if (refreshToken && token) {
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, refreshToken })
            }).then(res => res.json()).then(resJson => {
              isRefreshing = false;
              if (resJson?.data?.token) {
                localStorage.setItem('parkly_token', resJson.data.token);
                if (resJson.data.refreshToken) {
                  localStorage.setItem('parkly_refreshToken', resJson.data.refreshToken);
                }
                const userObj = JSON.parse(localStorage.getItem('parkly_user') || '{}');
                localStorage.setItem('parkly_user', JSON.stringify({ ...userObj, ...resJson.data }));
                return resJson.data.token;
              }
              throw new Error('Refresh failed');
            }).catch(e => {
              isRefreshing = false;
              throw e;
            });
          }

          try {
            const newToken = await refreshPromise;
            // Retry original request with new token
            headers.Authorization = `Bearer ${newToken}`;
            response = await fetch(url, {
              ...options,
              headers,
            });
            json = await response.json().catch(() => null);
            if (response.ok) {
              return json;
            }
          } catch (e) {
            // Refresh failed, logout
            localStorage.removeItem('parkly_token');
            localStorage.removeItem('parkly_refreshToken');
            localStorage.removeItem('parkly_user');
            window.location.href = '/login';
            throw e;
          }
        } else {
          // No refresh token available, logout immediately
          localStorage.removeItem('parkly_token');
          localStorage.removeItem('parkly_refreshToken');
          localStorage.removeItem('parkly_user');
          window.location.href = '/login';
        }
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
