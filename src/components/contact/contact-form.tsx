"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactFormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: ContactFormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as {
        data: { id: string } | null;
        error: { message: string } | null;
      };

      if (!response.ok || !result.data) {
        throw new Error(result.error?.message ?? "Gagal mengirim pesan");
      }

      setMessage("Terima kasih. Tim kami akan menghubungi Anda segera.");
      setForm(initialForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengirim pesan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-brand-800/70 bg-brand-925/70 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-brand-200">Nama</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="border-brand-700 bg-brand-950 text-brand-100"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company" className="text-brand-200">Perusahaan (opsional)</Label>
          <Input
            id="company"
            value={form.company}
            onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
            className="border-brand-700 bg-brand-950 text-brand-100"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-brand-200">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="border-brand-700 bg-brand-950 text-brand-100"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-brand-200">No. HP</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="border-brand-700 bg-brand-950 text-brand-100"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-brand-200">Kebutuhan Proyek</Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          className="min-h-28 border-brand-700 bg-brand-950 text-brand-100"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand-300 text-brand-950 hover:bg-brand-200"
      >
        {loading ? "Mengirim..." : "Kirim Lead"}
      </Button>

      {message ? <p className="text-sm text-brand-300">{message}</p> : null}
    </form>
  );
}
