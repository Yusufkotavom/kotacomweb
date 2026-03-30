create table if not exists public.contact_leads (
  id uuid primary key,
  name text not null,
  company text,
  email text not null,
  phone text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted')),
  created_at timestamptz not null default now()
);

create index if not exists contact_leads_created_at_idx
  on public.contact_leads(created_at desc);
