/** True when resume can open directly in browser (Firebase Storage URL). */
export function isDirectResumeUrl(resumeUrl) {
  return !!resumeUrl && resumeUrl.startsWith('http');
}

export function getResumeViewUrl(resumeUrl) {
  if (!resumeUrl) return null;
  if (isDirectResumeUrl(resumeUrl)) return resumeUrl;
  return null;
}

export function getResumeDownloadLabel(resumeUrl) {
  if (!resumeUrl) return 'Download Resume';
  const lower = resumeUrl.toLowerCase();
  if (lower.includes('.pdf') || lower.endsWith('.pdf')) return 'Download PDF';
  return 'Download Resume';
}
