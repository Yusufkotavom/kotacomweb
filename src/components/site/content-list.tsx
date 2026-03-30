import Link from "next/link";

import type { ContentEntry } from "@/lib/content/types";

import { Badge } from "@/components/ui/badge";

type ContentListProps = {
  items: ContentEntry[];
  emptyText: string;
  basePath: string;
};

export function ContentList({ items, emptyText, basePath }: ContentListProps) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-800 p-8 text-sm text-brand-300">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="group rounded-2xl border border-brand-800/70 bg-brand-900/35 p-5 transition-colors hover:border-brand-600"
        >
          <div className="mb-2 flex items-center gap-3">
            <Badge className="bg-brand-300 text-brand-950">{item.status}</Badge>
            <span className="font-mono text-xs text-brand-400">/{item.slug}</span>
          </div>
          <Link href={`${basePath}/${item.slug}`} className="text-xl tracking-tight text-white">
            {item.title}
          </Link>
          <p className="mt-2 text-sm leading-6 text-brand-300">{item.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
