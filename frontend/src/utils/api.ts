// API utility for consistent URL handling
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 