const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('smartshopping_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || data.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
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
    create: (productId, targetPrice) => fetchAPI('/price-alerts', { method: 'POST', body: JSON.stringify({ product_id: productId, target_price: targetPrice }) }),
    delete: (id) => fetchAPI(`/price-alerts/${id}`, { method: 'DELETE' }),
  },

  profile: {
    get: () => fetchAPI('/profile'),
  },
};
