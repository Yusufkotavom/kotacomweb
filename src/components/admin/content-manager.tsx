"use client";

import { useMemo, useState } from "react";

import type { ContentEntry, ContentType } from "@/lib/content/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContentManagerProps = {
  type: ContentType;
  title: string;
  initialItems: ContentEntry[];
};

type FormState = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: "draft" | "published";
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  status: "draft",
};

export function ContentManager({ type, title, initialItems }: ContentManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [items],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const method = form.id ? "PATCH" : "POST";
    const endpoint = form.id ? `/api/admin/${type}/${form.id}` : `/api/admin/${type}`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug,
          title: form.title,
          excerpt: form.excerpt,
          body: form.body,
          status: form.status,
          meta: {},
        }),
      });

      const result = (await response.json()) as {
        data: ContentEntry | null;
        error: { message: string } | null;
      };

      if (!response.ok || !result.data) {
        throw new Error(result.error?.message ?? "Request failed");
      }

      if (form.id) {
        setItems((current) => current.map((item) => (item.id === result.data!.id ? result.data! : item)));
      } else {
        setItems((current) => [result.data!, ...current]);
      }

      setForm(emptyForm);
      setMessage("Konten berhasil disimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan konten.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/${type}/${id}`, { method: "DELETE" });
      const result = (await response.json()) as {
        data: { deleted: true } | null;
        error: { message: string } | null;
      };

      if (!response.ok) {
        throw new Error(result.error?.message ?? "Failed to delete");
      }

      setItems((current) => current.filter((item) => item.id !== id));
      if (form.id === id) {
        setForm(emptyForm);
      }
      setMessage("Konten berhasil dihapus.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menghapus konten.");
    } finally {
      setLoading(false);
    }
  }

  function loadToEditor(item: ContentEntry) {
    setForm({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      body: item.body,
      status: item.status,
    });
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-brand-800/70 bg-brand-925/70 p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-400">Manage</p>
            <h2 className="mt-1 text-lg tracking-tight text-white">{title}</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-brand-700 bg-transparent text-brand-200"
            onClick={() => setForm(emptyForm)}
          >
            New
          </Button>
        </div>
        <div className="space-y-3">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-brand-800 bg-brand-950/70 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="text-left"
                  onClick={() => loadToEditor(item)}
                >
                  <p className="text-sm text-white">{item.title}</p>
                  <p className="font-mono text-[11px] text-brand-400">/{item.slug}</p>
                </button>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-300 text-brand-950">{item.status}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 px-2 text-red-300 hover:bg-red-500/15 hover:text-red-200"
                    onClick={() => handleDelete(item.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {!sortedItems.length ? (
            <p className="rounded-xl border border-dashed border-brand-800 p-4 text-sm text-brand-400">
              Belum ada konten.
            </p>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-800/70 bg-brand-925/70 p-4 md:p-5">
        <h3 className="text-sm uppercase tracking-[0.16em] text-brand-400">Editor</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${type}-slug`} className="text-brand-200">
              Slug
            </Label>
            <Input
              id={`${type}-slug`}
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              className="border-brand-700 bg-brand-950 text-brand-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${type}-title`} className="text-brand-200">
              Title
            </Label>
            <Input
              id={`${type}-title`}
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="border-brand-700 bg-brand-950 text-brand-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${type}-excerpt`} className="text-brand-200">
              Excerpt
            </Label>
            <Textarea
              id={`${type}-excerpt`}
              value={form.excerpt}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
              className="min-h-24 border-brand-700 bg-brand-950 text-brand-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${type}-body`} className="text-brand-200">
              Body
            </Label>
            <Textarea
              id={`${type}-body`}
              value={form.body}
              onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
              className="min-h-40 border-brand-700 bg-brand-950 text-brand-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${type}-status`} className="text-brand-200">
              Status
            </Label>
            <select
              id={`${type}-status`}
              className="h-10 w-full rounded-md border border-brand-700 bg-brand-950 px-3 text-sm text-brand-100"
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value as FormState["status"] }))
              }
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-300 text-brand-950 hover:bg-brand-200"
          >
            {loading ? "Menyimpan..." : form.id ? "Update" : "Create"}
          </Button>

          {message ? <p className="text-sm text-brand-300">{message}</p> : null}
        </div>
      </form>
    </section>
  );
}
