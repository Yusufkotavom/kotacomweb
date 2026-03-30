import { requireAdminUser } from "@/lib/auth";
import { listAdminContent } from "@/lib/content/repository";

import { ContentManager } from "@/components/admin/content-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPage() {
  const user = await requireAdminUser();

  const [services, products, posts, portfolio, pages] = await Promise.all([
    listAdminContent("services"),
    listAdminContent("products"),
    listAdminContent("posts"),
    listAdminContent("portfolio"),
    listAdminContent("pages"),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-brand-400">CMS Dashboard</p>
          <h1 className="mt-2 text-3xl tracking-[-0.04em] text-white">Konten Website</h1>
        </div>
        <p className="font-mono text-xs text-brand-300">{user.email}</p>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-full border border-brand-800 bg-brand-925/70 p-1">
          <TabsTrigger value="services" className="rounded-full data-[state=active]:bg-brand-300 data-[state=active]:text-brand-950">
            Services
          </TabsTrigger>
          <TabsTrigger value="products" className="rounded-full data-[state=active]:bg-brand-300 data-[state=active]:text-brand-950">
            Shop
          </TabsTrigger>
          <TabsTrigger value="posts" className="rounded-full data-[state=active]:bg-brand-300 data-[state=active]:text-brand-950">
            Blog
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="rounded-full data-[state=active]:bg-brand-300 data-[state=active]:text-brand-950">
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="pages" className="rounded-full data-[state=active]:bg-brand-300 data-[state=active]:text-brand-950">
            Pages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ContentManager type="services" title="Service Content" initialItems={services} />
        </TabsContent>
        <TabsContent value="products">
          <ContentManager type="products" title="Shop Catalog" initialItems={products} />
        </TabsContent>
        <TabsContent value="posts">
          <ContentManager type="posts" title="Blog Articles" initialItems={posts} />
        </TabsContent>
        <TabsContent value="portfolio">
          <ContentManager type="portfolio" title="Portfolio Cases" initialItems={portfolio} />
        </TabsContent>
        <TabsContent value="pages">
          <ContentManager type="pages" title="Static Pages" initialItems={pages} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
