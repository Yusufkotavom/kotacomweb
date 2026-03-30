create table if not exists public.content_entries (
  id uuid primary key,
  type text not null check (type in ('pages', 'services', 'products', 'posts', 'portfolio')),
  slug text not null,
  title text not null,
  excerpt text not null,
  body text not null,
  status text not null check (status in ('draft', 'published')),
  cover_image text,
  meta jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug)
);

create index if not exists content_entries_type_status_published_idx
  on public.content_entries(type, status, published_at desc);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (key, value)
values (
  'default',
  '{
    "siteName": "Kotacom",
    "tagline": "Percetakan dan IT Service untuk pertumbuhan bisnis modern.",
    "whatsappNumber": "6281234567890",
    "email": "hello@kotacom.id",
    "phone": "+62 21 5555 8800",
    "address": "Jakarta, Indonesia",
    "nav": [
      {"label": "Layanan", "href": "/services"},
      {"label": "Shop", "href": "/shop"},
      {"label": "Blog", "href": "/blog"},
      {"label": "Portfolio", "href": "/portfolio"},
      {"label": "Kontak", "href": "/contact"}
    ],
    "social": [
      {"label": "Instagram", "href": "https://instagram.com"},
      {"label": "LinkedIn", "href": "https://linkedin.com"}
    ]
  }'::jsonb
)
on conflict (key) do nothing;
