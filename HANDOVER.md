# VDORT Project — Handover Guide

## Live URLs
| Service | URL |
|---------|-----|
| Website | https://www.vdort.us |
| API | https://vdort-services.onrender.com/api |
| API Health | https://vdort-services.onrender.com/api/health |

## Admin / Client / Student Login
| Portal | URL | Default Login |
|--------|-----|---------------|
| Admin | https://www.vdort.us/admin/login | admin@vdort.com / admin123 |
| Client | https://www.vdort.us/client/login | client@vdort.com / client123 |
| Student | https://www.vdort.us/login | Firebase signup |

Firebase admin: `vdort042@gmail.com` (role: admin in Firestore `users` collection)

## Render Server — Environment Variables
Copy from `server/render-env-paste.txt` → Render Dashboard → vdort-api → Environment → Save → Manual Deploy.

Required secrets:
- `FIREBASE_PRIVATE_KEY`
- `SMTP_PASS`
- `JWT_SECRET`

Required domains (CORS):
```
CLIENT_URL=https://vdort.us,https://www.vdort.us,https://vdort-services.vercel.app
ALLOWED_ORIGINS=https://vdort.us,https://www.vdort.us,https://vdort-services.vercel.app
```

## Firebase Console Checklist
1. **Authentication** → Authorized domains: add `vdort.us`, `www.vdort.us`
2. **Storage** → bucket `vdort-28207.firebasestorage.app` → `resumes/` folder
3. **Firestore** → `applications`, `users`, `jobs` collections

## Deploy Steps
1. **Git push** → Vercel auto-deploys frontend
2. **Render** → Manual Deploy after env vars set
3. Test: submit resume → check Firebase Storage → admin download

## Key Features Working
- Public website (responsive)
- Resume submit (instant success, Firebase upload in background)
- Admin: view/download/delete resumes (48h auto-delete)
- Email notifications with resume attachment
- Forgot password (admin/client email)
- Student job apply with ATS score

## Contact Info (on website)
- Email: Careeers@vdortservices.com
- Phone: +1 (888) 500-5453
- Address: Dehradun, Uttarakhand, India
