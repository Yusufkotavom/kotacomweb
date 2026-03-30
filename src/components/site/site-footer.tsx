import Link from "next/link";

import type { SiteSettings } from "@/lib/content/types";

import { Button } from "@/components/ui/button";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  return (
    <footer className="border-t border-zinc-200/80 bg-white text-zinc-700 dark:border-brand-800/70 dark:bg-brand-950 dark:text-brand-200">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <section className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-6 md:p-8 dark:border-brand-800/70 dark:bg-brand-925/70">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-brand-400">{settings.siteName}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <h2 className="max-w-xl text-2xl tracking-[-0.04em] text-zinc-900 dark:text-white md:text-3xl">
              Percetakan dan IT service untuk tim yang ingin bergerak lebih cepat.
            </h2>
            <Button asChild className="rounded-full bg-zinc-900 px-5 text-white hover:bg-zinc-800 dark:bg-white dark:text-brand-950 dark:hover:bg-brand-100">
              <Link href="/contact">Start Project</Link>
            </Button>
          </div>
        </section>

        <section className="mt-10 grid gap-10 border-t border-zinc-200 pt-10 dark:border-brand-800/60 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="text-sm text-zinc-600 dark:text-brand-300">{settings.tagline}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 dark:text-brand-400">Navigation</p>
            <ul className="mt-3 space-y-2">
              {settings.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-zinc-700 transition-colors hover:text-zinc-900 dark:text-brand-200 dark:hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 dark:text-brand-400">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-brand-200">
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-zinc-900 dark:hover:text-white">
                  {settings.email}
                </a>
              </li>
              <li>{settings.phone}</li>
              <li>{settings.address}</li>
              {settings.social.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-zinc-900 dark:hover:text-white" target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-10 border-t border-zinc-200 pt-5 text-xs text-zinc-500 dark:border-brand-800/60 dark:text-brand-400">
          © {new Date().getFullYear()} {settings.siteName}. Crafted for performance.
        </div>
      </div>
    </footer>
  );
}
