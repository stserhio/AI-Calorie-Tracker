/** Base URL for API requests. Empty locally (proxy); set VITE_API_URL in production. */
export const API_BASE = (import.meta.env?.VITE_API_URL ?? '').replace(/\/$/, '');

export const PARSE_FOOD_URL = `${API_BASE}/api/parse-food`;
