import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { readDuas, readCategoriesData } from "../../lib/data";

export async function GET() {
  try {
    const duas = readDuas();
    const categoriesData = readCategoriesData();
    
    // Calculate statistics
    const totalDuas = duas.length;
    const duasWithoutAudio = duas.filter(d => !d.audio || d.audio.trim() === "").length;
    const totalCategories = categoriesData.categories.length;
    const totalSubcategories = categoriesData.categories.reduce(
      (acc, cat) => acc + (cat.subcategories?.length || 0),
      0
    );
    
    // Get file sizes
    const duasPath = path.join(process.cwd(), "..", "assets", "data", "duas.json");
    const categoriesPath = path.join(process.cwd(), "..", "assets", "data", "categories.json");
    const audioDirPath = path.join(process.cwd(), "..", "assets", "audio");

    // Local tracking (ignored by git) for download timestamps
    const trackingFilePath = path.join(process.cwd(), "_static", "download-tracking.json");
    
    let duasFileSize = 0;
    let categoriesFileSize = 0;
    let audioFilesSize = 0;

    let duasLastUpdatedAt: string | null = null;
    let categoriesLastUpdatedAt: string | null = null;

    let duasLastDownloadedAt: string | null = null;
    let categoriesLastDownloadedAt: string | null = null;
    
    try {
      const duasStats = fs.statSync(duasPath);
      duasFileSize = duasStats.size;
      duasLastUpdatedAt = duasStats.mtime?.toISOString?.() ?? new Date(duasStats.mtimeMs).toISOString();
    } catch {
      // File might not exist
    }
    
    try {
      const categoriesStats = fs.statSync(categoriesPath);
      categoriesFileSize = categoriesStats.size;
      categoriesLastUpdatedAt =
        categoriesStats.mtime?.toISOString?.() ?? new Date(categoriesStats.mtimeMs).toISOString();
    } catch {
      // File might not exist
    }

    // Read last-downloaded timestamps (if present)
    try {
      const raw = fs.readFileSync(trackingFilePath, "utf8");
      const parsed = JSON.parse(raw) as Partial<{
        duasLastDownloadedAt: string;
        categoriesLastDownloadedAt: string;
      }>;
      if (typeof parsed.duasLastDownloadedAt === "string") {
        duasLastDownloadedAt = parsed.duasLastDownloadedAt;
      }
      if (typeof parsed.categoriesLastDownloadedAt === "string") {
        categoriesLastDownloadedAt = parsed.categoriesLastDownloadedAt;
      }
    } catch {
      // tracking file might not exist yet
    }

    // Sum all mp3 sizes in assets/audio (flat folder)
    try {
      const entries = fs.readdirSync(audioDirPath, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (!entry.name.toLowerCase().endsWith(".mp3")) continue;

        try {
          const p = path.join(audioDirPath, entry.name);
          audioFilesSize += fs.statSync(p).size;
        } catch {
          // ignore unreadable file
        }
      }
    } catch {
      // Folder might not exist
    }
    
    return NextResponse.json({
      totalDuas,
      duasWithoutAudio,
      duasWithAudio: totalDuas - duasWithoutAudio,
      totalCategories,
      totalSubcategories,
      duasFileSize,
      categoriesFileSize,
      audioFilesSize,

      // Timestamps
      duasLastUpdatedAt,
      categoriesLastUpdatedAt,
      duasLastDownloadedAt,
      categoriesLastDownloadedAt,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
