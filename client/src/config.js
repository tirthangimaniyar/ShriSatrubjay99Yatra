// Application Configuration
// In production, VITE_API_URL should be set to your Render backend URL (e.g. https://shrisatrubjay99yatra.onrender.com)
// In local development, it defaults to http://localhost:5000
const getProductionFallbackUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
    return 'https://shrisatrubjay99yatra.onrender.com';
  }
  return 'http://localhost:5000';
};

const rawBaseUrl = import.meta.env.VITE_API_URL || getProductionFallbackUrl();
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
