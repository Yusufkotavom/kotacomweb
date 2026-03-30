"use client";

import { useState } from "react";
import Link from "next/link";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase belum dikonfigurasi. Untuk mode lokal, akses /admin langsung.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Magic link dikirim. Cek inbox email admin.");
    }

    setLoading(false);
  }

  return (
    <main className="mx-auto flex min-h-[75vh] w-full max-w-md flex-col justify-center px-5 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-400">Kotacom CMS</p>
      <h1 className="mt-3 text-3xl tracking-[-0.04em] text-white">Admin Login</h1>
      <p className="mt-2 text-sm text-brand-300">Masuk menggunakan magic link Supabase.</p>

      <form onSubmit={handleMagicLink} className="mt-8 space-y-4 rounded-2xl border border-brand-800 bg-brand-925/70 p-5">
        <Input
          type="email"
          value={email}
          placeholder="admin@kotacom.id"
          onChange={(event) => setEmail(event.target.value)}
          className="border-brand-700 bg-brand-950 text-brand-100"
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-300 text-brand-950 hover:bg-brand-200"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </Button>
        {message ? <p className="text-sm text-brand-300">{message}</p> : null}
      </form>

      <Link href="/" className="mt-6 text-sm text-brand-300 underline underline-offset-4">
        Kembali ke website
      </Link>
    </main>
  );
}
