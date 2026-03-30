import { listPublicContent } from "@/lib/content/repository";

import { ContentList } from "@/components/site/content-list";
import { SectionHeader } from "@/components/site/section-header";

export default async function PortfolioPage() {
  const items = await listPublicContent("portfolio", 24);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        eyebrow="Portfolio"
        title="Case Studies"
        description="Contoh project yang kami eksekusi untuk kebutuhan branding dan IT operations."
      />
      <ContentList items={items} emptyText="Belum ada portfolio yang dipublikasikan." basePath="/portfolio" />
    </main>
  );
}
