"use client";

import { useMemo, useState } from "react";

import type { SiteSettings } from "@/lib/content/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SiteSettingsFormProps = {
  initialSettings: SiteSettings;
};

type SiteSettingsState = {
  siteName: string;
  tagline: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: string;
  navText: string;
  socialText: string;
};

function linksToText(links: Array<{ label: string; href: string }>) {
  return links.map((item) => `${item.label}|${item.href}`).join("\n");
}

function textToLinks(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|");
      return {
        label: label?.trim() ?? "",
        href: href?.trim() ?? "",
      };
    })
    .filter((item) => item.label && item.href);
}

export function SiteSettingsForm({ initialSettings }: SiteSettingsFormProps) {
  const [form, setForm] = useState<SiteSettingsState>({
    siteName: initialSettings.siteName,
    tagline: initialSettings.tagline,
    whatsappNumber: initialSettings.whatsappNumber,
    email: initialSettings.email,
    phone: initialSettings.phone,
    address: initialSettings.address,
    navText: linksToText(initialSettings.nav),
    socialText: linksToText(initialSettings.social),
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navPreview = useMemo(() => textToLinks(form.navText), [form.navText]);
  const socialPreview = useMemo(() => textToLinks(form.socialText), [form.socialText]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: form.siteName,
          tagline: form.tagline,
          whatsappNumber: form.whatsappNumber,
          email: form.email,
          phone: form.phone,
          address: form.address,
          nav: textToLinks(form.navText),
          social: textToLinks(form.socialText),
        }),
      });

      const result = (await response.json()) as {
        data: SiteSettings | null;
        error: { message: string } | null;
      };

      if (!response.ok || !result.data) {
        throw new Error(result.error?.message ?? "Failed to save settings");
      }

      setMessage("Site settings berhasil diperbarui.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="space-y-4 rounded-2xl border border-brand-800/70 bg-brand-925/70 p-5">
        <h2 className="text-lg tracking-tight text-white">Brand & Contact</h2>

        <div className="space-y-2">
          <Label htmlFor="siteName" className="text-brand-200">
            Site Name
          </Label>
          <Input
            id="siteName"
            value={form.siteName}
            onChange={(event) => setForm((prev) => ({ ...prev, siteName: event.target.value }))}
            className="border-brand-700 bg-brand-950 text-brand-100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline" className="text-brand-200">
            Tagline
          </Label>
          <Textarea
            id="tagline"
            value={form.tagline}
            onChange={(event) => setForm((prev) => ({ ...prev, tagline: event.target.value }))}
            className="min-h-20 border-brand-700 bg-brand-950 text-brand-100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappNumber" className="text-brand-200">
            WhatsApp Number
          </Label>
          <Input
            id="whatsappNumber"
            value={form.whatsappNumber}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, whatsappNumber: event.target.value }))
            }
            className="border-brand-700 bg-brand-950 text-brand-100"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-brand-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="border-brand-700 bg-brand-950 text-brand-100"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-brand-200">
              Phone
            </Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="border-brand-700 bg-brand-950 text-brand-100"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-brand-200">
            Address
          </Label>
          <Textarea
            id="address"
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
            className="min-h-20 border-brand-700 bg-brand-950 text-brand-100"
            required
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-brand-800/70 bg-brand-925/70 p-5">
        <h2 className="text-lg tracking-tight text-white">Navigation & Social</h2>
        <p className="text-sm text-brand-400">Gunakan format `Label|/path` per baris.</p>

        <div className="space-y-2">
          <Label htmlFor="navText" className="text-brand-200">
            Navigation Links
          </Label>
          <Textarea
            id="navText"
            value={form.navText}
            onChange={(event) => setForm((prev) => ({ ...prev, navText: event.target.value }))}
            className="min-h-28 border-brand-700 bg-brand-950 font-mono text-xs text-brand-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="socialText" className="text-brand-200">
            Social Links
          </Label>
          <Textarea
            id="socialText"
            value={form.socialText}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, socialText: event.target.value }))
            }
            className="min-h-24 border-brand-700 bg-brand-950 font-mono text-xs text-brand-100"
          />
        </div>

        <div className="grid gap-4 rounded-xl border border-brand-800 bg-brand-950/60 p-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-brand-400">Parsed Nav</p>
            <ul className="mt-2 space-y-1 text-sm text-brand-200">
              {navPreview.map((item) => (
                <li key={`${item.label}-${item.href}`}>{item.label} → {item.href}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-brand-400">Parsed Social</p>
            <ul className="mt-2 space-y-1 text-sm text-brand-200">
              {socialPreview.map((item) => (
                <li key={`${item.label}-${item.href}`}>{item.label} → {item.href}</li>
              ))}
            </ul>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-300 text-brand-950 hover:bg-brand-200"
        >
          {loading ? "Saving..." : "Save Site Settings"}
        </Button>

        {message ? <p className="text-sm text-brand-300">{message}</p> : null}
      </section>
    </form>
  );
}
