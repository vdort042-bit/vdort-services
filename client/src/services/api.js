import { getApiBases } from '../config/apiConfig.js';

const DEFAULT_TIMEOUT_MS = 20000;
const UPLOAD_TIMEOUT_MS = 90000;

async function getFirebaseToken(forceRefresh = false) {
  try {
    const { auth } = await import('../firebase/firebase');
    if (auth.authStateReady) await auth.authStateReady();
    const user = auth.currentUser;
    if (user) return await user.getIdToken(forceRefresh);
  } catch {
    // ignore
  }
  return null;
}

async function getAuthToken() {
  const jwt = localStorage.getItem('vdort_token');
  if (jwt) return jwt;
  return getFirebaseToken(false);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function request(endpoint, options = {}) {
  const token = options.useFirebaseToken
    ? await getFirebaseToken(false)
    : await getAuthToken();
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const bases = getApiBases();
  const timeoutMs = options.body instanceof FormData ? UPLOAD_TIMEOUT_MS : DEFAULT_TIMEOUT_MS;

  let lastNetworkErr;
  for (const base of bases) {
    let res;
    try {
      res = await fetchWithTimeout(`${base}${endpoint}`, { ...options, headers }, timeoutMs);
    } catch (networkErr) {
      lastNetworkErr = networkErr;
      continue;
    }

    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : { message: await res.text() };

    if (!res.ok) {
      throw new Error(data.message || `Request failed (${res.status})`);
    }

    return data;
  }

  if (lastNetworkErr?.name === 'AbortError') {
    throw new Error('Server is waking up — please wait a moment and try again.');
  }

  throw new Error(lastNetworkErr?.message?.includes('fetch')
    ? 'Network error — please check your connection.'
    : 'Network error — please check your connection.');
}

export const api = {
  health: () => request('/health'),

  auth: {
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => request('/auth/me'),
    firebaseExchange: (idToken) =>
      request('/auth/firebase-exchange', { method: 'POST', body: JSON.stringify({ idToken }) }),
    forgotPassword: (email) =>
      request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token, newPassword) =>
      request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
  },

  jobs: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/jobs${qs ? `?${qs}` : ''}`);
    },
    get: (id) => request(`/jobs/${id}`),
    manage: () => request('/jobs/manage/all'),
    create: (data) => request('/jobs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
  },

  applications: {
    submit: (formData) => request('/applications', { method: 'POST', body: formData }),
    list: () => request('/applications'),
    mine: () => request('/applications/mine', { useFirebaseToken: true }),
    clientList: () => request('/applications/client'),
    updateStatus: (id, status) =>
      request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete: (id) => request(`/applications/${id}`, { method: 'DELETE' }),
  },

  contacts: {
    submit: (data) => request('/contacts', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/contacts'),
    updateStatus: (id, status) =>
      request(`/contacts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),
  },

  subscribers: {
    subscribe: (email) => request('/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
    list: () => request('/subscribers'),
    delete: (id) => request(`/subscribers/${id}`, { method: 'DELETE' }),
  },

  testimonials: {
    list: (featured) => request(`/testimonials${featured ? '?featured=true' : ''}`),
    create: (data) => request('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/testimonials/${id}`, { method: 'DELETE' }),
  },

  analytics: {
    overview: () => request('/analytics/overview'),
    client: () => request('/analytics/client'),
    recent: () => request('/analytics/recent'),
    chart: () => request('/analytics/chart'),
    monthly: (year, month) => request(`/analytics/monthly?year=${year}&month=${month}`),
  },

  users: {
    listClients:  () => request('/users/clients'),
    createClient: (data) => request('/users/clients', { method: 'POST', body: JSON.stringify(data) }),
    updateClient: (id, data) => request(`/users/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteClient: (id) => request(`/users/clients/${id}`, { method: 'DELETE' }),

    listStudents:  () => request('/users/students'),
    setStudentStatus: (uid, disabled) =>
      request(`/users/students/${uid}/status`, { method: 'PATCH', body: JSON.stringify({ disabled }) }),
    deleteStudent: (uid) => request(`/users/students/${uid}`, { method: 'DELETE' }),
  },

  notifications: {
    list: () => request('/notifications', { useFirebaseToken: true }),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH', useFirebaseToken: true }),
    markAllRead: () => request('/notifications/read-all', { method: 'PATCH', useFirebaseToken: true }),
  },
};

export default api;
