import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getAdminUser } from "@/lib/auth";
import { createContent, listAdminContent } from "@/lib/content/repository";
import { contentTypeSchema } from "@/lib/content/schema";

const pathMap = {
  services: "/services",
  products: "/shop",
  posts: "/blog",
  portfolio: "/portfolio",
  pages: "/",
} as const;

function revalidateForType(type: keyof typeof pathMap) {
  revalidatePath(pathMap[type]);
  revalidatePath("/");
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ type: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized" }, meta: null },
      { status: 401 },
    );
  }

  const { type: rawType } = await context.params;
  const typeResult = contentTypeSchema.safeParse(rawType);
  if (!typeResult.success) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid content type" }, meta: null },
      { status: 400 },
    );
  }

  const data = await listAdminContent(typeResult.data);
  return NextResponse.json({ data, error: null, meta: { count: data.length } });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ type: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized" }, meta: null },
      { status: 401 },
    );
  }

  const { type: rawType } = await context.params;
  const typeResult = contentTypeSchema.safeParse(rawType);

  if (!typeResult.success) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid content type" }, meta: null },
      { status: 400 },
    );
  }

  try {
    const payload = await request.json();
    const data = await createContent(typeResult.data, payload);
    revalidateForType(typeResult.data);
    return NextResponse.json({ data, error: null, meta: null }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: { message: error instanceof Error ? error.message : "Failed to create content" },
        meta: null,
      },
      { status: 400 },
    );
  }
}
