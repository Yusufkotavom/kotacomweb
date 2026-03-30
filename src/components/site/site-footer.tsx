import Link from "next/link";

import type { SiteSettings } from "@/lib/content/types";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  return (
    <footer className="border-t border-brand-800/70 bg-brand-950 text-brand-200">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xl tracking-[-0.03em] text-white">{settings.siteName}</p>
            <p className="mt-2 max-w-md text-sm text-brand-300">{settings.tagline}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-400">Navigation</p>
            <ul className="mt-3 space-y-2 text-sm">
              {settings.nav.map((item) => (
                <li key={item.href}>
                  <Link className="hover:text-white" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-400">Contact</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>{settings.email}</li>
              <li>{settings.phone}</li>
              <li>{settings.address}</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-brand-400">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
