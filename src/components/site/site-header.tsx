import Link from "next/link";

import type { SiteSettings } from "@/lib/content/types";

import { Button } from "@/components/ui/button";

type SiteHeaderProps = {
  settings: SiteSettings;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="text-lg font-medium tracking-[-0.03em] text-white">
          {settings.siteName}
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-brand-100 md:flex">
          {settings.nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" className="rounded-full bg-brand-300 text-brand-950 hover:bg-brand-200">
          <Link href="/contact">Konsultasi</Link>
        </Button>
      </div>
    </header>
  );
}
