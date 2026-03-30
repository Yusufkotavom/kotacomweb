import { defaultSettings } from "@/lib/content/seed";
import { getSiteSettings } from "@/lib/content/repository";

export async function getSiteConfig() {
  try {
    return await getSiteSettings();
  } catch {
    return defaultSettings;
  }
}

export function toWhatsappHref(number: string, message = "Halo Kotacom, saya ingin konsultasi proyek.") {
  const normalized = number.replace(/[^\d]/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
