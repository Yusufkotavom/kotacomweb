import postgres from "postgres";

import { contentInputSchema, contentUpdateSchema, siteSettingsSchema } from "@/lib/content/schema";
import { defaultSettings, seedContent } from "@/lib/content/seed";
import type { ContentEntry, ContentType, SiteSettings } from "@/lib/content/types";

const DATABASE_URL = process.env.DATABASE_URL;

const memoryStore = {
  content: [...seedContent],
  settings: { ...defaultSettings },
};

let sqlClient: postgres.Sql | null = null;

function getSql() {
  if (!DATABASE_URL) {
    return null;
  }

  if (!sqlClient) {
    sqlClient = postgres(DATABASE_URL, { prepare: false, max: 2 });
  }

  return sqlClient;
}

function toEntry(row: {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: "draft" | "published";
  cover_image: string | null;
  meta: Record<string, unknown>;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}): ContentEntry {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    status: row.status,
    coverImage: row.cover_image,
    meta: row.meta ?? {},
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function sortByPublishedAtDesc(a: ContentEntry, b: ContentEntry): number {
  return (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt);
}

export async function listPublicContent(type: ContentType, limit = 12): Promise<ContentEntry[]> {
  const sql = getSql();

  if (!sql) {
    return memoryStore.content
      .filter((item) => item.type === type && item.status === "published")
      .sort(sortByPublishedAtDesc)
      .slice(0, limit);
  }

  const rows = await sql<{
    id: string;
    type: ContentType;
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    status: "draft" | "published";
    cover_image: string | null;
    meta: Record<string, unknown>;
    published_at: string | null;
    created_at: string;
    updated_at: string;
  }[]>`
    select id, type, slug, title, excerpt, body, status, cover_image, meta, published_at, created_at, updated_at
    from content_entries
    where type = ${type} and status = 'published'
    order by coalesce(published_at, updated_at) desc
    limit ${limit}
  `;

  return rows.map(toEntry);
}

export async function listAdminContent(type: ContentType): Promise<ContentEntry[]> {
  const sql = getSql();

  if (!sql) {
    return memoryStore.content
      .filter((item) => item.type === type)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  const rows = await sql<{
    id: string;
    type: ContentType;
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    status: "draft" | "published";
    cover_image: string | null;
    meta: Record<string, unknown>;
    published_at: string | null;
    created_at: string;
    updated_at: string;
  }[]>`
    select id, type, slug, title, excerpt, body, status, cover_image, meta, published_at, created_at, updated_at
    from content_entries
    where type = ${type}
    order by updated_at desc
  `;

  return rows.map(toEntry);
}

export async function getContentBySlug(
  type: ContentType,
  slug: string,
  includeDraft = false,
): Promise<ContentEntry | null> {
  const sql = getSql();

  if (!sql) {
    return (
      memoryStore.content.find(
        (item) =>
          item.type === type &&
          item.slug === slug &&
          (includeDraft || item.status === "published"),
      ) ?? null
    );
  }

  const rows = await sql<{
    id: string;
    type: ContentType;
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    status: "draft" | "published";
    cover_image: string | null;
    meta: Record<string, unknown>;
    published_at: string | null;
    created_at: string;
    updated_at: string;
  }[]>`
    select id, type, slug, title, excerpt, body, status, cover_image, meta, published_at, created_at, updated_at
    from content_entries
    where type = ${type}
      and slug = ${slug}
      ${includeDraft ? sql`` : sql`and status = 'published'`}
    limit 1
  `;

  return rows[0] ? toEntry(rows[0]) : null;
}

export async function getContentById(type: ContentType, id: string): Promise<ContentEntry | null> {
  const sql = getSql();

  if (!sql) {
    return memoryStore.content.find((item) => item.type === type && item.id === id) ?? null;
  }

  const rows = await sql<{
    id: string;
    type: ContentType;
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    status: "draft" | "published";
    cover_image: string | null;
    meta: Record<string, unknown>;
    published_at: string | null;
    created_at: string;
    updated_at: string;
  }[]>`
    select id, type, slug, title, excerpt, body, status, cover_image, meta, published_at, created_at, updated_at
    from content_entries
    where type = ${type} and id = ${id}
    limit 1
  `;

  return rows[0] ? toEntry(rows[0]) : null;
}

export async function createContent(type: ContentType, payload: unknown): Promise<ContentEntry> {
  const parsed = contentInputSchema.parse(payload);
  const timestamp = new Date().toISOString();
  const data = {
    id: crypto.randomUUID(),
    type,
    slug: parsed.slug,
    title: parsed.title,
    excerpt: parsed.excerpt,
    body: parsed.body,
    status: parsed.status,
    coverImage: parsed.coverImage,
    meta: parsed.meta,
    publishedAt: parsed.status === "published" ? timestamp : null,
    createdAt: timestamp,
    updatedAt: timestamp,
  } satisfies ContentEntry;

  const sql = getSql();
  if (!sql) {
    const duplicate = memoryStore.content.find((item) => item.type === type && item.slug === data.slug);
    if (duplicate) {
      throw new Error("Slug already exists");
    }

    memoryStore.content.unshift(data);
    return data;
  }

  await sql`
    insert into content_entries (
      id, type, slug, title, excerpt, body, status, cover_image, meta, published_at, created_at, updated_at
    )
    values (
      ${data.id}, ${data.type}, ${data.slug}, ${data.title}, ${data.excerpt}, ${data.body}, ${data.status},
      ${data.coverImage}, ${sql.json(data.meta as postgres.JSONValue)}, ${data.publishedAt}, ${data.createdAt}, ${data.updatedAt}
    )
  `;

  return data;
}

export async function updateContent(
  type: ContentType,
  id: string,
  payload: unknown,
): Promise<ContentEntry | null> {
  const existing = await getContentById(type, id);
  if (!existing) {
    return null;
  }

  const parsed = contentUpdateSchema.parse(payload);
  const timestamp = new Date().toISOString();
  const merged: ContentEntry = {
    ...existing,
    ...parsed,
    coverImage: parsed.coverImage ?? existing.coverImage,
    meta: parsed.meta ?? existing.meta,
    publishedAt:
      parsed.status === "published" && !existing.publishedAt
        ? timestamp
        : existing.publishedAt,
    updatedAt: timestamp,
  };

  const sql = getSql();
  if (!sql) {
    const duplicate = memoryStore.content.find(
      (item) => item.type === type && item.slug === merged.slug && item.id !== id,
    );
    if (duplicate) {
      throw new Error("Slug already exists");
    }

    memoryStore.content = memoryStore.content.map((item) => (item.id === id ? merged : item));
    return merged;
  }

  await sql`
    update content_entries
    set slug = ${merged.slug},
        title = ${merged.title},
        excerpt = ${merged.excerpt},
        body = ${merged.body},
        status = ${merged.status},
        cover_image = ${merged.coverImage},
        meta = ${sql.json(merged.meta as postgres.JSONValue)},
        published_at = ${merged.publishedAt},
        updated_at = ${merged.updatedAt}
    where id = ${id} and type = ${type}
  `;

  return merged;
}

export async function deleteContent(type: ContentType, id: string): Promise<boolean> {
  const sql = getSql();

  if (!sql) {
    const before = memoryStore.content.length;
    memoryStore.content = memoryStore.content.filter((item) => !(item.type === type && item.id === id));
    return memoryStore.content.length < before;
  }

  const result = await sql`
    delete from content_entries
    where type = ${type} and id = ${id}
  `;

  return result.count > 0;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const sql = getSql();

  if (!sql) {
    return memoryStore.settings;
  }

  const rows = await sql<{ value: SiteSettings }[]>`
    select value
    from site_settings
    where key = 'default'
    limit 1
  `;

  if (!rows[0]) {
    return defaultSettings;
  }

  return siteSettingsSchema.parse(rows[0].value);
}

export async function upsertSiteSettings(payload: unknown): Promise<SiteSettings> {
  const settings = siteSettingsSchema.parse(payload);
  const sql = getSql();

  if (!sql) {
    memoryStore.settings = settings;
    return settings;
  }

  await sql`
    insert into site_settings (key, value, updated_at)
    values ('default', ${sql.json(settings as postgres.JSONValue)}, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;

  return settings;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getSql());
}
