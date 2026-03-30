import type { MetadataRoute } from "next";

import { listPublicContent } from "@/lib/content/repository";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const [services, products, posts, portfolio] = await Promise.all([
    listPublicContent("services", 200),
    listPublicContent("products", 200),
    listPublicContent("posts", 200),
    listPublicContent("portfolio", 200),
  ]);

  const staticRoutes = ["", "/services", "/shop", "/blog", "/portfolio", "/contact"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...services.map((item) => ({
      url: `${baseUrl}/services/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...products.map((item) => ({
      url: `${baseUrl}/shop/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...portfolio.map((item) => ({
      url: `${baseUrl}/portfolio/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
