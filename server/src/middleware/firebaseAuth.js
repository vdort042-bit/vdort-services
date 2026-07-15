import { getAuth } from 'firebase-admin/auth';

export async function authenticateFirebase(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = await getAuth().verifyIdToken(token);
    req.firebaseUser = { uid: decoded.uid, email: (decoded.email || '').toLowerCase() };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
