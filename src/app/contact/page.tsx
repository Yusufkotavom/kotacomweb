import Link from "next/link";

import { getSiteConfig, toWhatsappHref } from "@/lib/site";

import { Button } from "@/components/ui/button";

export default async function ContactPage() {
  const settings = await getSiteConfig();

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-12 md:px-8 md:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-400">Contact</p>
      <h1 className="mt-3 text-4xl tracking-[-0.04em] text-white">Mari mulai proyek Anda</h1>
      <p className="mt-4 text-lg leading-8 text-brand-300">
        Ceritakan kebutuhan percetakan atau IT service Anda. Tim kami akan bantu susun scope dan estimasi.
      </p>

      <div className="mt-8 grid gap-4 rounded-2xl border border-brand-800/70 bg-brand-925/70 p-5 md:grid-cols-2">
        <div>
          <p className="text-sm text-brand-400">Email</p>
          <p className="mt-1 text-base text-white">{settings.email}</p>
        </div>
        <div>
          <p className="text-sm text-brand-400">Phone</p>
          <p className="mt-1 text-base text-white">{settings.phone}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-brand-400">Address</p>
          <p className="mt-1 text-base text-white">{settings.address}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="rounded-full bg-brand-300 px-6 text-brand-950 hover:bg-brand-200">
          <Link href={toWhatsappHref(settings.whatsappNumber)}>Chat WhatsApp</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-brand-600 bg-transparent text-brand-100">
          <Link href={`mailto:${settings.email}`}>Kirim Email</Link>
        </Button>
      </div>
    </main>
  );
}
