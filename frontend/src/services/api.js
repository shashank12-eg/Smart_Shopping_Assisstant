// Dynamic API base URL: defaults to '/api' (handled by Nginx in Docker or Vite proxy locally)
const rawBase = import.meta.env.VITE_API_URL || '/api';
const API_BASE = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('smartshopping_token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${cleanEndpoint}`;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    const error = new Error(
      `Network connection error: Unable to connect to server at ${url}. ` +
      `Please check your connection and verify the backend service is running.`
    );
    error.status = 0;
    error.isNetworkError = true;
    error.cause = networkErr;
    throw error;
  }

  // Inspect response Content-Type to prevent JSON parse errors on HTML responses
  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (parseErr) {
      console.warn('Failed to parse JSON body despite application/json header', parseErr);
      data = null;
    }
  } else {
    // Read text safely if non-JSON (HTML 404, 502, etc.)
    try {
      const text = await response.text();
      if (text && !text.trim().startsWith('<') && text.length < 200) {
        data = { message: text.trim() };
      }
    } catch (e) {
      // Ignore text read error
    }
  }

  if (!response.ok) {
    let errorMessage = 'API request failed';

    if (data && (data.error || data.message)) {
      errorMessage = data.error || data.message;
    } else if (response.status === 404) {
      errorMessage = `API endpoint not found (404) at ${url}. Please verify Nginx proxy or backend route.`;
    } else if (response.status === 502) {
      errorMessage = 'Backend service is unavailable (502 Bad Gateway). Flask server might still be initializing.';
    } else if (response.status === 503) {
      errorMessage = 'Backend service is temporarily unavailable (503 Service Unavailable). Database may be starting up.';
    } else if (response.status === 504) {
      errorMessage = 'Gateway timeout (504). Request took too long to complete.';
    } else if (response.status === 500) {
      errorMessage = 'Internal server error (500). Please check backend server logs.';
    } else if (response.status === 401 || response.status === 403) {
      errorMessage = data?.error || 'Authentication required or invalid credentials.';
    } else {
      errorMessage = `Server responded with status ${response.status} (${response.statusText || 'Error'}).`;
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data ?? {};
}

export const api = {
  auth: {
    login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    signup: (userData) => fetchAPI('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
    me: () => fetchAPI('/auth/me'),
  },

  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchAPI(`/products${query ? `?${query}` : ''}`);
    },
    getDetail: (id) => fetchAPI(`/products/${id}`),
    getSuggestions: (q) => fetchAPI(`/products/suggestions?q=${encodeURIComponent(q)}`),
    getCategories: () => fetchAPI('/categories'),
    compare: (ids) => fetchAPI(`/products/compare?ids=${ids.join(',')}`),
  },

  wishlist: {
    get: () => fetchAPI('/wishlist'),
    add: (productId) => fetchAPI('/wishlist', { method: 'POST', body: JSON.stringify({ product_id: productId }) }),
    remove: (productId) => fetchAPI(`/wishlist/${productId}`, { method: 'DELETE' }),
  },

  searchHistory: {
    get: () => fetchAPI('/search-history'),
    delete: (id) => fetchAPI(`/search-history/${id}`, { method: 'DELETE' }),
    clear: () => fetchAPI('/search-history/clear', { method: 'DELETE' }),
  },

  recentlyViewed: {
    get: () => fetchAPI('/recently-viewed'),
  },

  priceAlerts: {
    get: () => fetchAPI('/price-alerts'),
    create: (productId, targetPrice, dropPercentage) =>
      fetchAPI('/price-alerts', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          target_price: targetPrice,
          drop_percentage: dropPercentage || null,
        }),
      }),
    toggle: (id, status) =>
      fetchAPI(`/price-alerts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    delete: (id) => fetchAPI(`/price-alerts/${id}`, { method: 'DELETE' }),
  },

  urlAnalyze: {
    analyze: (url) =>
      fetchAPI('/url-analyze', {
        method: 'POST',
        body: JSON.stringify({ url }),
      }),
  },

  profile: {
    get: () => fetchAPI('/profile'),
  },
};
