# Cyber 17 Official — Certificate Issuance & Verification Platform

Production certificate platform for **Cyber 17 Official**.

## Live

- Public: https://cyber17-certificate-platform.vercel.app
- Admin login: https://cyber17-certificate-platform.vercel.app/admin/login

## Stack

- Next.js 15 + TypeScript + Tailwind
- Prisma + **PostgreSQL (Neon)**
- NextAuth (credentials)
- QR verification URLs only (no PII in QR)

## First-time setup (production)

1. Set `DATABASE_URL` (Neon Postgres) on Vercel.
2. Deploy (build runs `prisma db push`).
3. Call one-time seed:

```bash
curl -X POST https://cyber17-certificate-platform.vercel.app/api/setup
```

This creates admin + demo certificates **only if no admin exists**.

### Demo admin

- Email: `admin@cyber17.official`
- Password: `Cyber17Admin!2026`

## Local

```bash
cp .env.example .env
# set DATABASE_URL to Neon
npm install
npx prisma db push
npm run db:seed   # or curl localhost:3000/api/setup
npm run dev
```

## Env

See `.env.example`. Required:

- `DATABASE_URL` — Neon Postgres
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL`

## License

Proprietary — Cyber 17 Official
