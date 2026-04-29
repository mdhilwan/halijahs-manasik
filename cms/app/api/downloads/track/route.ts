import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type TrackFile = "duas" | "categories";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<{ file: TrackFile }>;
    const file = body.file;

    if (file !== "duas" && file !== "categories") {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    // Stored locally and ignored by git.
    const trackingDir = path.join(process.cwd(), "_static");
    const trackingFilePath = path.join(trackingDir, "download-tracking.json");

    // Ensure directory exists
    try {
      fs.mkdirSync(trackingDir, { recursive: true });
    } catch {
      // ignore
    }

    let current: Record<string, unknown> = {};
    try {
      const raw = fs.readFileSync(trackingFilePath, "utf8");
      current = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      // file may not exist yet
    }

    const nowIso = new Date().toISOString();

    if (file === "duas") {
      current.duasLastDownloadedAt = nowIso;
    } else {
      current.categoriesLastDownloadedAt = nowIso;
    }

    fs.writeFileSync(trackingFilePath, JSON.stringify(current, null, 2) + "\n", "utf8");

    return NextResponse.json({ ok: true, at: nowIso });
  } catch (error) {
    console.error("Error tracking download:", error);
    return NextResponse.json({ error: "Failed to track download" }, { status: 500 });
  }
}

