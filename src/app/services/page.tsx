import { listPublicContent } from "@/lib/content/repository";

import { ContentList } from "@/components/site/content-list";
import { SectionHeader } from "@/components/site/section-header";

export default async function ServicesPage() {
  const items = await listPublicContent("services", 24);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        eyebrow="Services"
        title="Layanan Percetakan & IT Service"
        description="Paket layanan operasional yang bisa dikustom sesuai target bisnis Anda."
      />
      <ContentList items={items} emptyText="Belum ada layanan yang dipublikasikan." basePath="/services" />
    </main>
  );
}
