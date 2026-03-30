import { z } from "zod";

import { CONTENT_TYPES } from "@/lib/content/types";

export const contentTypeSchema = z.enum(CONTENT_TYPES);

const metaSchema = z.record(z.string(), z.unknown()).optional().default({});

export const contentInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().min(8).max(320),
  body: z.string().trim().min(20),
  status: z.enum(["draft", "published"]),
  coverImage: z.string().url().nullable().optional().default(null),
  meta: metaSchema,
});

export const contentUpdateSchema = contentInputSchema.partial();

export const publicQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(2).max(120),
  tagline: z.string().min(8).max(180),
  whatsappNumber: z.string().min(8).max(32),
  email: z.string().email(),
  phone: z.string().min(6).max(40),
  address: z.string().min(8).max(240),
  nav: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  social: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
});
