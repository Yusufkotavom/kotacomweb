import { NextResponse } from "next/server";

import { getAdminUser } from "@/lib/auth";
import { listAdminLeads } from "@/lib/content/repository";

export async function GET() {
  const user = await getAdminUser();

  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized" }, meta: null },
      { status: 401 },
    );
  }

  const data = await listAdminLeads();
  return NextResponse.json({ data, error: null, meta: { count: data.length } });
}
