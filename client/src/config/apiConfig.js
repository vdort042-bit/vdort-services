/** Production API on Render — proxied via Vercel rewrites as /api */
const PROD_API = '/api';
const DEV_API = 'http://localhost:5000/api';
const RENDER_API = 'https://vdort-services.onrender.com/api';

function resolveApiBase() {
  const env = import.meta.env.VITE_API_URL?.trim();

  // Production build must never call localhost (common deploy mistake)
  if (import.meta.env.PROD) {
    if (!env || env.includes('localhost') || env.includes('127.0.0.1')) {
      return PROD_API;
    }
    return env;
  }

  return env || DEV_API;
}

export const API_BASE = resolveApiBase();

/** Server origin for resume file URLs (no /api suffix) */
export function getApiOrigin() {
  if (API_BASE.startsWith('http')) {
    return API_BASE.replace(/\/api\/?$/, '');
  }
  // Relative /api — same origin (Vercel proxy) or direct Render URL fallback
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return RENDER_API.replace(/\/api\/?$/, '');
}
