import Link from "next/link";

import { getContentBySlug, listPublicContent } from "@/lib/content/repository";
import { getSiteConfig, toWhatsappHref } from "@/lib/site";

import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const [settings, home, services, products, posts] = await Promise.all([
    getSiteConfig(),
    getContentBySlug("pages", "home"),
    listPublicContent("services", 3),
    listPublicContent("products", 3),
    listPublicContent("posts", 3),
  ]);

  const heroTitle = (home?.meta.heroTitle as string | undefined) ?? "Build Brand. Scale Operations.";
  const heroSubtitle =
    (home?.meta.heroSubtitle as string | undefined) ??
    "Partner percetakan dan IT service untuk tim yang butuh hasil cepat dan rapi.";

  return (
    <main>
      <section className="relative overflow-hidden border-b border-brand-800/70 bg-brand-950">
        <div className="mx-auto grid min-h-[calc(100svh-64px)] w-full max-w-6xl content-center gap-10 px-5 py-16 md:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">KOTACOM</p>
            <h1 className="text-balance text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-white md:text-7xl">
              {heroTitle}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-brand-200">{heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-brand-300 px-6 text-brand-950 hover:bg-brand-200">
                <Link href="/contact">Konsultasi Proyek</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-brand-600 bg-transparent text-brand-100">
                <Link href="/services">Lihat Layanan</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[...services, ...products, ...posts].slice(0, 3).map((item) => (
              <article key={item.id} className="rounded-2xl border border-brand-800/80 bg-brand-925/70 p-4">
                <p className="font-mono text-xs text-brand-400">/{item.type}</p>
                <h2 className="mt-2 text-xl tracking-tight text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-brand-300">{item.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-7 px-5 py-16 md:px-8 md:py-20">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-400">Focus Areas</p>
          <h2 className="mt-3 text-3xl tracking-[-0.04em] text-white md:text-4xl">Percetakan dan IT Service dalam satu alur kerja</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="border-l border-brand-700 pl-4">
            <h3 className="text-xl text-white">Percetakan Premium</h3>
            <p className="mt-2 text-sm leading-7 text-brand-300">
              Produksi materi visual dari konsep hingga finishing, cocok untuk kebutuhan promosi, event, dan sales kit.
            </p>
          </article>
          <article className="border-l border-brand-700 pl-4">
            <h3 className="text-xl text-white">Managed IT Support</h3>
            <p className="mt-2 text-sm leading-7 text-brand-300">
              Setup, maintenance, dan troubleshooting infrastruktur IT untuk membantu tim tetap fokus ke bisnis inti.
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-brand-800/70 bg-brand-925/80">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-12 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-400">Quick Contact</p>
            <p className="mt-2 text-2xl tracking-tight text-white">Diskusikan project kamu hari ini</p>
          </div>
          <Button asChild className="rounded-full bg-brand-300 px-6 text-brand-950 hover:bg-brand-200">
            <Link href={toWhatsappHref(settings.whatsappNumber)}>Chat WhatsApp</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
