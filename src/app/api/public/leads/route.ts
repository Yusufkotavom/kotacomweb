import { NextResponse } from "next/server";

import { createLead } from "@/lib/content/repository";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = await createLead(payload);

    return NextResponse.json({ data, error: null, meta: null }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: { message: error instanceof Error ? error.message : "Failed to submit lead" },
        meta: null,
      },
      { status: 400 },
    );
  }
}
