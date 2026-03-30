import { listPublicContent } from "@/lib/content/repository";

import { ContentList } from "@/components/site/content-list";
import { SectionHeader } from "@/components/site/section-header";

export default async function BlogPage() {
  const items = await listPublicContent("posts", 24);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        eyebrow="Blog"
        title="Artikel & Insight"
        description="Konten edukasi untuk strategi marketing, SEO, dan operasi IT bisnis."
      />
      <ContentList items={items} emptyText="Belum ada artikel yang dipublikasikan." basePath="/blog" />
    </main>
  );
}
