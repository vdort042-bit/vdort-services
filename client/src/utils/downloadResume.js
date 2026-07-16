import { API_BASE } from '../config/apiConfig';

async function getAuthToken() {
  const jwt = localStorage.getItem('vdort_token');
  if (jwt) return jwt;
  try {
    const { auth } = await import('../firebase/firebase');
    if (auth.authStateReady) await auth.authStateReady();
    const user = auth.currentUser;
    if (user) return await user.getIdToken(true);
  } catch {
    // ignore
  }
  return null;
}

function parseFilename(contentDisposition) {
  if (!contentDisposition) return null;
  const utf8 = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8) return decodeURIComponent(utf8[1]);
  const plain = contentDisposition.match(/filename="?([^";\n]+)"?/i);
  return plain?.[1]?.trim() || null;
}

export async function downloadResume(applicationId) {
  await fetchResumeBlob(applicationId, 'attachment');
}

export async function openResumeInBrowser(applicationId) {
  const { blob, filename } = await fetchResumeBlob(applicationId, 'inline');
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, '_blank');
  if (!opened) {
    URL.revokeObjectURL(url);
    throw new Error('Pop-up blocked — allow pop-ups or use Download instead.');
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return filename;
}

async function fetchResumeBlob(applicationId, mode) {
  const token = await getAuthToken();
  const res = await fetch(
    `${API_BASE}/applications/${applicationId}/resume/download${mode === 'inline' ? '?view=1' : ''}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to load resume');
  }

  const blob = await res.blob();
  const filename = parseFilename(res.headers.get('content-disposition')) || 'resume.pdf';

  if (mode === 'attachment') {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return { blob, filename };
}
