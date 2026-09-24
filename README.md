# Cyber 17 Official — Certificate Issuance & Verification Platform

Production-oriented digital certificate platform for **Cyber 17 Official**.

## Architecture

- **Frontend & Backend**: Next.js 15 (App Router) + TypeScript
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (production recommended)
- **Auth**: bcrypt password hashing + session-ready design (extend with NextAuth or iron-session)
- **QR**: `qrcode` — verification URL only (no PII)
- **PDF**: `pdf-lib` (extend for print-ready certificates)
- **Validation**: Zod
- **UI**: Tailwind CSS, dark professional cybersecurity aesthetic

## Features Implemented

### Public Website
- Home, About, Contact, Privacy, Terms
- Certificate verification by ID and by QR URL (`/verify/{certificateId}`)
- Result pages for VALID / NOT FOUND / REVOKED / EXPIRED
- Verification logging (result, timestamp; IP optional & privacy-aware)
- Responsive, accessible, professional dark UI

### Core Certificate Logic
- Secure unique Certificate ID generation (`C17-XXXX-XXXX-XXXX`)
- QR code generation pointing only to official verification URL
- Automatic expiry detection
- Revocation without deletion of record
- Public fields only on verification page

### Admin (Foundation)
- Role model: SUPER_ADMIN, ADMIN, CERTIFICATE_MANAGER, VIEWER
- Password hashing (bcrypt, 12 rounds)
- Audit log model
- Seed admin account

### Security Measures
- Security headers (CSP, X-Frame-Options, etc.)
- Server-side status evaluation
- No private data in QR
- Unique DB constraint on certificateId
- Input sanitization patterns
- Environment-based secrets
- .gitignore excludes secrets, uploads, DB files

## Quick Start

```bash
cd cyber17-certs
cp .env.example .env
# Edit .env if needed

npm install
npx prisma generate
npx prisma db push
npm run db:seed   # requires tsx; or npx tsx prisma/seed.ts

npm run dev
```

Open http://localhost:3000

**Demo admin** (from seed):
- Email: `admin@cyber17.official`
- Password: `Cyber17Admin!2026`

Demo certificate IDs are printed by the seed script.

## Environment Variables

See `.env.example`. Never commit real secrets.

## Production Notes

1. Switch `DATABASE_URL` to PostgreSQL.
2. Set strong `NEXTAUTH_SECRET` / session secret (≥32 chars).
3. Serve over HTTPS.
4. Configure rate limiting (e.g. reverse proxy or Upstash).
5. Store uploads on object storage (S3-compatible) in production.
6. Enable MFA for admins.
7. Review CSP and tighten further if no inline scripts needed.
8. Run `npm run build` and test thoroughly.

## API Sketch

- `GET /verify/{certificateId}` — public verification page
- Future admin APIs under `/api/admin/*` with server-side auth checks

## Remaining / Extension Points

- Full admin dashboard UI (certificates CRUD, charts, logs)
- PDF certificate generation & download
- NextAuth or iron-session full session flow + CSRF
- Rate limiting middleware
- Image upload validation pipeline
- MFA (TOTP)
- More comprehensive E2E tests

The verification flow, certificate model, QR design, status handling, and public pages are fully functional end-to-end once dependencies are installed and the database is seeded.

## License

Proprietary — Cyber 17 Official
