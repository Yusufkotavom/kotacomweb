import { defaultSettings } from "@/lib/content/seed";
import { getSiteSettings } from "@/lib/content/repository";

const fallbackSiteUrl = "https://kotacom.id";

export async function getSiteConfig() {
  try {
    return await getSiteSettings();
  } catch {
    return defaultSettings;
  }
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!envUrl) {
    return fallbackSiteUrl;
  }

  return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
}

export function toWhatsappHref(number: string, message = "Halo Kotacom, saya ingin konsultasi proyek.") {
  const normalized = number.replace(/[^\d]/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
