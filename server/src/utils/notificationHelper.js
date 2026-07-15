import { v4 as uuid } from 'uuid';

const STATUS_MESSAGES = {
  new: 'Your resume has been received and is under review.',
  reviewing: 'Your application is being reviewed by our team.',
  shortlisted: 'Your resume is shortlisted.',
  interviewed: 'You have been selected for an interview.',
  hired: 'Congratulations! You have been hired.',
  rejected: 'Your application was not selected at this time.',
};

const STATUS_LABELS = {
  new: 'Received',
  reviewing: 'Under Review',
  shortlisted: 'Shortlisted',
  interviewed: 'Interview',
  hired: 'Hired',
  rejected: 'Not Selected',
};

export function getStatusMessage(status) {
  return STATUS_MESSAGES[status] || `Your application status is now: ${status}`;
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function getStatusTitle(status) {
  if (status === 'shortlisted') return 'Your resume is shortlisted';
  return `Status: ${getStatusLabel(status)}`;
}

export async function createStatusNotification(notificationsStore, application, status) {
  const notification = {
    id: `notif_${uuid().slice(0, 8)}`,
    userId: application.userId || null,
    email: (application.email || '').toLowerCase(),
    applicationId: application.id,
    status,
    title: getStatusTitle(status),
    message: getStatusMessage(status),
    read: false,
    createdAt: new Date().toISOString(),
  };
  await notificationsStore.create(notification);
  return notification;
}
