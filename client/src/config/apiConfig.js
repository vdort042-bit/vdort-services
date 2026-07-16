/** Production API on Render */
const RENDER_API = 'https://vdort-services.onrender.com/api';
/** Dev: Vite proxy — works with localhost, 127.0.0.1, and LAN IP */
const DEV_API = '/api';

function resolveApiBase() {
  const env = import.meta.env.VITE_API_URL?.trim();

  if (import.meta.env.PROD) {
    // Direct Render URL — more reliable than Vercel /api proxy
    if (!env || env.includes('localhost') || env.includes('127.0.0.1')) {
      return RENDER_API;
    }
    return env;
  }

  // Prefer Vite proxy in dev unless a full http URL is explicitly set
  if (!env || env === '/api') return DEV_API;
  return env;
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
