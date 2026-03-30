import { NextResponse } from "next/server";

import { getContentBySlug } from "@/lib/content/repository";
import { contentTypeSchema } from "@/lib/content/schema";

export async function GET(
  _request: Request,
  context: { params: Promise<{ type: string; slug: string }> },
) {
  const { type: rawType, slug } = await context.params;
  const typeResult = contentTypeSchema.safeParse(rawType);

  if (!typeResult.success) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid content type" }, meta: null },
      { status: 400 },
    );
  }

  const data = await getContentBySlug(typeResult.data, slug);

  if (!data) {
    return NextResponse.json(
      { data: null, error: { message: "Content not found" }, meta: null },
      { status: 404 },
    );
  }

  return NextResponse.json({ data, error: null, meta: null });
}
