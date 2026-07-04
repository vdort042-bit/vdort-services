const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('vdort_token');
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  } catch (networkErr) {
    throw new Error('Network error — please check your connection.');
  }

  // Handle non-JSON responses gracefully
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : { message: await res.text() };

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
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
};

export default api;
