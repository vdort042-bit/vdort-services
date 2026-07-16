/** Production API on Render (fallback) */
const RENDER_API = 'https://vdort-services.onrender.com/api';
/** Dev: Vite proxy */
const DEV_API = '/api';

function resolveApiBase() {
  const env = import.meta.env.VITE_API_URL?.trim();

  // Browser production: same-origin /api (vdort.us, vercel.app) — no CORS issues
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }

  if (import.meta.env.PROD) {
    if (env?.startsWith('http') && !env.includes('localhost') && !env.includes('127.0.0.1')) {
      return env.replace(/\/$/, '');
    }
    return RENDER_API;
  }

  if (!env || env === '/api') return DEV_API;
  return env;
}

export const API_BASE = resolveApiBase();

/** API bases to try — same-origin first, then Render direct */
export function getApiBases() {
  const bases = [];
  if (typeof window !== 'undefined') {
    bases.push(`${window.location.origin}/api`);
  }
  if (API_BASE && !bases.includes(API_BASE)) bases.push(API_BASE);
  if (!bases.includes(RENDER_API)) bases.push(RENDER_API);
  return [...new Set(bases)];
}

/** Server origin for resume file URLs (no /api suffix) */
export function getApiOrigin() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  if (API_BASE.startsWith('http')) {
    return API_BASE.replace(/\/api\/?$/, '');
  }
  return RENDER_API.replace(/\/api\/?$/, '');
}
