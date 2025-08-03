// API utility for consistent URL handling
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://movedin-backend.onrender.com';

export const apiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 