import { getApiOrigin } from '../config/apiConfig';

export function getResumeViewUrl(resumeUrl) {
  if (!resumeUrl) return null;
  if (resumeUrl.startsWith('http')) return resumeUrl;
  return `${getApiOrigin()}${resumeUrl}`;
}

export function getResumeDownloadLabel(resumeUrl) {
  if (!resumeUrl) return 'Download Resume';
  const lower = resumeUrl.toLowerCase();
  if (lower.includes('.pdf') || lower.endsWith('.pdf')) return 'Download PDF';
  return 'Download Resume';
}
