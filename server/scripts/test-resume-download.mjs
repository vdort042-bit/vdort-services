import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfPath = path.join(__dirname, '../uploads/demo-resume.pdf');
const outPath = path.join(__dirname, '../uploads/downloaded-test.pdf');

const token = jwt.sign(
  { id: 'usr_admin_001', email: 'admin@vdort.com', role: 'admin', name: 'Admin' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

async function main() {
  const pdfBytes = fs.readFileSync(pdfPath);
  const form = new FormData();
  form.append('name', 'Demo Candidate');
  form.append('email', 'demo.candidate@vdort.com');
  form.append('experience', '3 years');
  form.append('resume', new Blob([pdfBytes], { type: 'application/pdf' }), 'demo-resume.pdf');

  const submitRes = await fetch('http://localhost:5000/api/applications', {
    method: 'POST',
    body: form,
  });
  const submitData = await submitRes.json();
  if (!submitRes.ok) throw new Error(submitData.message || 'Submit failed');

  const appId = submitData.data.id;
  console.log('Submitted application:', appId, submitData.data.resumeUrl);

  const downloadRes = await fetch(`http://localhost:5000/api/applications/${appId}/resume/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!downloadRes.ok) {
    const err = await downloadRes.json().catch(() => ({}));
    throw new Error(err.message || `Download failed (${downloadRes.status})`);
  }

  const buffer = Buffer.from(await downloadRes.arrayBuffer());
  fs.writeFileSync(outPath, buffer);

  console.log('Download OK');
  console.log('Status:', downloadRes.status);
  console.log('Content-Type:', downloadRes.headers.get('content-type'));
  console.log('Content-Disposition:', downloadRes.headers.get('content-disposition'));
  console.log('Saved to:', outPath);
  console.log('File size:', buffer.length, 'bytes');
}

main().catch((err) => {
  console.error('Test failed:', err.message);
  process.exit(1);
});
