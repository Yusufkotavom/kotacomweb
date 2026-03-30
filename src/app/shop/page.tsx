import { listPublicContent } from "@/lib/content/repository";

import { ContentList } from "@/components/site/content-list";
import { SectionHeader } from "@/components/site/section-header";

export default async function ShopPage() {
  const items = await listPublicContent("products", 24);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        eyebrow="Shop"
        title="Katalog Produk"
        description="Katalog awal untuk kebutuhan display, print material, dan paket digital service."
      />
      <ContentList items={items} emptyText="Belum ada produk katalog yang dipublikasikan." basePath="/shop" />
    </main>
  );
}
