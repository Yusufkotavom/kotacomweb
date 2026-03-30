import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { getSiteConfig } from "@/lib/site";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kotacom | Percetakan & IT Service",
    template: "%s | Kotacom",
  },
  description:
    "Kotacom menyediakan layanan percetakan premium dan IT service untuk percepatan operasional bisnis.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteConfig();

  return (
    <html lang="id" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-brand-950 font-sans text-brand-50">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1400px_600px_at_8%_-5%,rgba(95,164,255,0.24),transparent),radial-gradient(1000px_500px_at_90%_0%,rgba(59,109,210,0.18),transparent)]" />
        <SiteHeader settings={settings} />
        <div className="flex min-h-[calc(100vh-64px)] flex-col">
          <div className="flex-1">{children}</div>
          <SiteFooter settings={settings} />
        </div>
      </body>
    </html>
  );
}
