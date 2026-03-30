import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

import { getAdminUser } from "@/lib/auth";

function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { data: null, error: { message: "Unauthorized" }, meta: null },
      { status: 401 },
    );
  }

  const payload = (await request.json().catch(() => null)) as { url?: string } | null;
  if (!payload?.url) {
    return NextResponse.json(
      { data: null, error: { message: "Missing url" }, meta: null },
      { status: 400 },
    );
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({
      data: {
        url: payload.url,
        provider: "local-fallback",
      },
      error: null,
      meta: null,
    });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.uploader.upload(payload.url, {
      folder: "kotacom-cms",
      resource_type: "image",
    });

    return NextResponse.json({
      data: {
        url: result.secure_url,
        provider: "cloudinary",
      },
      error: null,
      meta: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: { message: error instanceof Error ? error.message : "Upload failed" },
        meta: null,
      },
      { status: 500 },
    );
  }
}
