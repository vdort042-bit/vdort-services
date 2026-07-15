import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

export async function sendResumeNotification(application, resumeFilePath, originalFileName, resumeUrl = null) {
  const transport = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'vdort042@gmail.com';

  if (!transport) {
    const err = new Error('Email not configured — add SMTP_PASS (Gmail App Password) in server/.env');
    console.warn('📧', err.message);
    throw err;
  }

  const skills = application.skills || '';
  const message = application.message || '';
  const atsScore = application.atsScore != null ? `${application.atsScore}%` : '—';

  const text = [
    'New Candidate Resume — VDORT Services',
    '========================================',
    '',
    `Full Name:      ${application.name}`,
    `Email:          ${application.email}`,
    `Phone:          ${application.phone || '—'}`,
    `Experience:     ${application.experience || '—'}`,
    `Skills:         ${skills || '—'}`,
    `Message:        ${message || '—'}`,
    `ATS Score:      ${atsScore}`,
    `Submitted On:   ${application.createdAt}`,
    `Application ID: ${application.id}`,
    '',
    resumeFilePath ? 'Resume file is attached to this email.' : `Resume link: ${resumeUrl || '—'}`,
  ].join('\n');

  const row = (label, value) =>
    `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:140px;">${label}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${value || '—'}</td></tr>`;

  const mailOptions = {
    from: `"VDORT Services" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    replyTo: application.email,
    subject: `New Resume — ${application.name} (${application.email})`,
    text,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#1e3a5f;margin-bottom:4px;">New Candidate Resume</h2>
        <p style="color:#64748b;margin-top:0;">VDORT Services — Resume Submission</p>
        <table style="border-collapse:collapse;width:100%;margin-top:16px;font-size:14px;">
          ${row('Full Name', application.name)}
          ${row('Email', `<a href="mailto:${application.email}">${application.email}</a>`)}
          ${row('Phone', application.phone)}
          ${row('Experience', application.experience)}
          ${row('Skills', skills)}
          ${row('Message', message.replace(/\n/g, '<br>'))}
          ${row('ATS Score', atsScore)}
          ${row('Submitted', application.createdAt)}
        </table>
        <p style="margin-top:16px;color:#64748b;font-size:13px;">${resumeFilePath && fs.existsSync(resumeFilePath) ? '📎 Resume attached below.' : resumeUrl ? `📎 <a href="${resumeUrl}">View resume online</a>` : 'No resume file.'}</p>
      </div>
    `,
  };

  if (resumeFilePath && fs.existsSync(resumeFilePath)) {
    mailOptions.attachments = [{
      filename: originalFileName || path.basename(resumeFilePath),
      path: resumeFilePath,
    }];
  }

  await transport.sendMail(mailOptions);
  console.log(`📧 Resume email sent to ${adminEmail} for ${application.name}`);
  return true;
}

export function isEmailConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function verifyEmailConnection() {
  const transport = getTransporter();
  if (!transport) return { ok: false, message: 'SMTP_PASS missing in server/.env' };
  try {
    await transport.verify();
    return { ok: true, message: `Ready — emails go to ${process.env.ADMIN_EMAIL || 'vdort042@gmail.com'}` };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}
