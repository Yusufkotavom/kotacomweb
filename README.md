# Kotacom CMS + Frontend

Website marketing + simple CMS untuk Kotacom dengan stack:
- Next.js 16 (App Router)
- shadcn/ui + Geist font
- Theme brand biru gelap
- Custom CMS `/admin`
- API publik/admin
- Postgres (Supabase/Neon) dengan fallback in-memory seed

## Fitur v1

- Frontend pages: `/`, `/services`, `/shop`, `/blog`, `/portfolio`, `/contact`
- Dynamic detail pages per slug
- CMS dashboard: `/admin`
- CRUD content type: `services`, `products`, `posts`, `portfolio`, `pages`
- API contracts:
  - `GET /api/public/[type]`
  - `GET /api/public/[type]/[slug]`
  - `GET|POST /api/admin/[type]`
  - `PATCH|DELETE /api/admin/[type]/[id]`
  - `POST /api/media/upload`
- Supabase magic link callback: `/auth/callback`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy env:
```bash
cp .env.example .env.local
```

3. Jalankan dev server:
```bash
npm run dev
```

4. Buka:
- Website: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Database

Migration SQL ada di:
- `supabase/migrations/001_init.sql`

Jika `DATABASE_URL` belum diisi, aplikasi tetap jalan dengan seeded content in-memory.

## Auth Admin

- Dengan Supabase env terisi: login via magic link di `/admin/login`
- Tanpa Supabase env: mode fallback lokal, `/admin` tetap bisa diakses untuk development

## Quality Checks

```bash
npm run lint
npm run build
```
