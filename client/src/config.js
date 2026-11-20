// Application Configuration
// In production, VITE_API_URL should be set to your Render backend URL (e.g. https://your-backend.onrender.com)
// In local development, it defaults to http://localhost:5000
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
