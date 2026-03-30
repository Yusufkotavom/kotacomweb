import { NextResponse } from "next/server";

import { listPublicContent } from "@/lib/content/repository";
import { contentTypeSchema, publicQuerySchema } from "@/lib/content/schema";

export async function GET(
  request: Request,
  context: { params: Promise<{ type: string }> },
) {
  const { type: rawType } = await context.params;
  const typeResult = contentTypeSchema.safeParse(rawType);

  if (!typeResult.success) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid content type" }, meta: null },
      { status: 400 },
    );
  }

  const url = new URL(request.url);
  const queryResult = publicQuerySchema.safeParse({
    limit: url.searchParams.get("limit") ?? undefined,
  });

  if (!queryResult.success) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid query params" }, meta: null },
      { status: 400 },
    );
  }

  const data = await listPublicContent(typeResult.data, queryResult.data.limit);
  return NextResponse.json({ data, error: null, meta: { count: data.length } });
}
