import { NextResponse } from "next/server";
import type { PressRelease } from "@/data/pressReleases";
import {
  listPressReleases,
  upsertPressRelease,
  upsertPressReleases,
} from "@/lib/pressReleasesRepository";
import { PRESS_RELEASES } from "@/data/pressReleases";
import { logDbConnectionStatus } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requiredFields: Array<keyof PressRelease> = [
  "id",
  "title",
  "companyId",
  "company",
  "category",
  "publishedAt",
  "imageUrl",
  "content",
  "keywords",
  "timestamp",
];

const hasRequiredFields = (value: unknown): value is PressRelease => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return requiredFields.every((key) => key in value);
};

export async function GET() {
  try {
    const connected = await logDbConnectionStatus("GET /api/press-releases");
    if (!connected) {
      return NextResponse.json(
        {
          data: PRESS_RELEASES,
          dbConnected: false,
          warning: "Database is unreachable. Returned fallback data.",
        },
        { status: 200 }
      );
    }

    let data = await listPressReleases();

    if (data.length === 0) {
      await upsertPressReleases(PRESS_RELEASES);
      data = await listPressReleases();
    }

    return NextResponse.json({ data, dbConnected: true });
  } catch (error) {
    console.error("Failed to fetch press releases", error);
    return NextResponse.json(
      { error: "Failed to fetch press releases from database." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const connected = await logDbConnectionStatus("POST /api/press-releases");
    if (!connected) {
      return NextResponse.json(
        { error: "Database is unreachable." },
        { status: 503 }
      );
    }

    const body: unknown = await request.json();

    if (!hasRequiredFields(body)) {
      return NextResponse.json(
        { error: "Invalid payload. Required fields are missing." },
        { status: 400 }
      );
    }

    const release = await upsertPressRelease(body);

    return NextResponse.json({ data: release }, { status: 201 });
  } catch (error) {
    console.error("Failed to upsert press release", error);
    return NextResponse.json(
      { error: "Failed to save press release to database." },
      { status: 500 }
    );
  }
}
