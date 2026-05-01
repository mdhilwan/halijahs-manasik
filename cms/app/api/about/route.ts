import { NextResponse } from "next/server";
import { readAboutData, writeAboutData, type AboutData } from "../../lib/data";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => typeof v === "string");
}

export async function GET() {
  return NextResponse.json(readAboutData());
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Partial<AboutData>;

    // Minimal validation (keep endpoint flexible; UI ensures shape)
    if (!body || !isStringArray(body.about)) {
      return NextResponse.json({ error: "Invalid payload: about[] is required" }, { status: 400 });
    }

    if (!Array.isArray(body.contributors)) {
      return NextResponse.json({ error: "Invalid payload: contributors[] is required" }, { status: 400 });
    }

    if (!body.footer || typeof body.footer.socialsIntro !== "string" || !Array.isArray(body.footer.socialLinks)) {
      return NextResponse.json({ error: "Invalid payload: footer is required" }, { status: 400 });
    }

    writeAboutData(body as AboutData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("/api/about PUT error:", error);
    return NextResponse.json({ error: "Failed to update about.json" }, { status: 500 });
  }
}

