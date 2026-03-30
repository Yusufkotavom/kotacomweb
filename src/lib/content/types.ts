export const CONTENT_TYPES = [
  "pages",
  "services",
  "products",
  "posts",
  "portfolio",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];
export type ContentStatus = "draft" | "published";

export type ContentEntry = {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: ContentStatus;
  coverImage: string | null;
  meta: Record<string, unknown>;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: string;
  nav: Array<{ label: string; href: string }>;
  social: Array<{ label: string; href: string }>;
};

export type LeadEntry = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  message: string;
  status: "new" | "contacted";
  createdAt: string;
};
