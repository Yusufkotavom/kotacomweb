import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getAdminUser } from "@/lib/auth";
import { getSiteSettings, upsertSiteSettings } from "@/lib/content/repository";

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized" }, meta: null },
      { status: 401 },
    );
  }

  const data = await getSiteSettings();
  return NextResponse.json({ data, error: null, meta: null });
}

export async function PUT(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized" }, meta: null },
      { status: 401 },
    );
  }

  try {
    const payload = await request.json();
    const data = await upsertSiteSettings(payload);

    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/services");
    revalidatePath("/shop");
    revalidatePath("/blog");
    revalidatePath("/portfolio");

    return NextResponse.json({ data, error: null, meta: null });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: { message: error instanceof Error ? error.message : "Failed to update site settings" },
        meta: null,
      },
      { status: 400 },
    );
  }
}
