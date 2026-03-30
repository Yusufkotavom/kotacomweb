import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminUser = {
  id: string;
  email: string;
};

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createSupabaseServerClient();

  // Dev fallback when Supabase env is not configured yet.
  if (!supabase) {
    return {
      id: "local-admin",
      email: "local@kotacom.id",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}

export async function requireAdminUser(): Promise<AdminUser> {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

export async function hasAdminSession(): Promise<boolean> {
  return Boolean(await getAdminUser());
}
