import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { getSiteConfig } from "@/lib/site";

import { FloatingWhatsapp } from "@/components/site/floating-whatsapp";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";

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
    <html
      lang="id"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-white font-sans text-zinc-900 dark:bg-brand-950 dark:text-brand-50">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1200px_520px_at_8%_-5%,rgba(59,130,246,0.10),transparent),radial-gradient(900px_500px_at_90%_0%,rgba(147,197,253,0.12),transparent)] dark:bg-[radial-gradient(1400px_600px_at_8%_-5%,rgba(95,164,255,0.24),transparent),radial-gradient(1000px_500px_at_90%_0%,rgba(59,109,210,0.18),transparent)]" />
          <SiteHeader settings={settings} />
          <div className="flex min-h-[calc(100vh-64px)] flex-col">
            <div className="flex-1">{children}</div>
            <SiteFooter settings={settings} />
          </div>
          <FloatingWhatsapp number={settings.whatsappNumber} />
        </ThemeProvider>
      </body>
    </html>
  );
}
