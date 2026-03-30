import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getAdminUser } from "@/lib/auth";
import { deleteContent, updateContent } from "@/lib/content/repository";
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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ type: string; id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized" }, meta: null },
      { status: 401 },
    );
  }

  const { type: rawType, id } = await context.params;
  const typeResult = contentTypeSchema.safeParse(rawType);

  if (!typeResult.success) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid content type" }, meta: null },
      { status: 400 },
    );
  }

  try {
    const payload = await request.json();
    const data = await updateContent(typeResult.data, id, payload);

    if (!data) {
      return NextResponse.json(
        { data: null, error: { message: "Content not found" }, meta: null },
        { status: 404 },
      );
    }

    revalidateForType(typeResult.data);
    return NextResponse.json({ data, error: null, meta: null });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: { message: error instanceof Error ? error.message : "Failed to update content" },
        meta: null,
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ type: string; id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized" }, meta: null },
      { status: 401 },
    );
  }

  const { type: rawType, id } = await context.params;
  const typeResult = contentTypeSchema.safeParse(rawType);

  if (!typeResult.success) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid content type" }, meta: null },
      { status: 400 },
    );
  }

  const deleted = await deleteContent(typeResult.data, id);

  if (!deleted) {
    return NextResponse.json(
      { data: null, error: { message: "Content not found" }, meta: null },
      { status: 404 },
    );
  }

  revalidateForType(typeResult.data);
  return NextResponse.json({ data: { deleted: true }, error: null, meta: null });
}
