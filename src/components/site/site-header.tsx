"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import type { SiteSettings } from "@/lib/content/types";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  settings: SiteSettings;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur-2xl dark:border-brand-800/70 dark:bg-brand-950/70">
      <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[15px] font-medium tracking-[-0.02em] text-zinc-900 transition-colors hover:text-zinc-600 dark:text-white dark:hover:text-brand-200"
          >
            {settings.siteName}
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {settings.nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[13px] transition-colors",
                    active
                      ? "bg-zinc-900 text-white dark:bg-brand-900"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-brand-300 dark:hover:bg-brand-925 dark:hover:text-brand-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="hidden rounded-full bg-zinc-900 px-4 text-white hover:bg-zinc-800 dark:bg-white dark:text-brand-950 dark:hover:bg-brand-100 md:inline-flex"
          >
            <Link href="/contact">Book a Call</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-zinc-700 hover:bg-zinc-100 dark:text-brand-100 dark:hover:bg-brand-900 md:hidden"
              >
                <Menu className="size-4" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] border-zinc-200 bg-white text-zinc-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-100">
              <SheetHeader>
                <SheetTitle className="text-left text-zinc-900 dark:text-white">{settings.siteName}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 dark:text-brand-400">Theme</p>
                <ThemeToggle />
              </div>
              <nav className="mt-4 grid gap-1">
                {settings.nav.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-xl px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-zinc-900 text-white dark:bg-brand-900"
                          : "text-zinc-600 hover:bg-zinc-100 dark:text-brand-300 dark:hover:bg-brand-925",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <Button asChild className="mt-6 w-full rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-brand-950 dark:hover:bg-brand-100">
                <Link href="/contact">Book a Call</Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
