import Link from "next/link";
import { notFound } from "next/navigation";

import { getContentBySlug } from "@/lib/content/repository";
import { getSiteConfig, toWhatsappHref } from "@/lib/site";

import { Button } from "@/components/ui/button";

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const [item, settings] = await Promise.all([getContentBySlug("products", slug), getSiteConfig()]);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-12 md:px-8 md:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-400">Shop Item</p>
      <h1 className="mt-3 text-4xl tracking-[-0.04em] text-white">{item.title}</h1>
      <p className="mt-4 text-lg leading-8 text-brand-300">{item.excerpt}</p>
      <p className="mt-8 whitespace-pre-line leading-8 text-brand-100">{item.body}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="rounded-full bg-brand-300 px-6 text-brand-950 hover:bg-brand-200">
          <Link href={toWhatsappHref(settings.whatsappNumber, `Halo Kotacom, saya tertarik produk ${item.title}.`)}>
            Tanya via WhatsApp
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-brand-600 bg-transparent text-brand-100">
          <Link href="/contact">Request Quote</Link>
        </Button>
      </div>
    </main>
  );
}
