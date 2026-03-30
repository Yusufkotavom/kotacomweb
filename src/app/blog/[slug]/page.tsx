import { notFound } from "next/navigation";

import { getContentBySlug } from "@/lib/content/repository";

export default async function BlogDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const item = await getContentBySlug("posts", slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-12 md:px-8 md:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-400">Article</p>
      <h1 className="mt-3 text-4xl tracking-[-0.04em] text-white">{item.title}</h1>
      <p className="mt-4 text-lg leading-8 text-brand-300">{item.excerpt}</p>
      <article className="mt-8">
        <p className="whitespace-pre-line leading-8 text-brand-100">{item.body}</p>
      </article>
    </main>
  );
}
