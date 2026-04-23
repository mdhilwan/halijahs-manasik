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
    
    let duasFileSize = 0;
    let categoriesFileSize = 0;
    
    try {
      const duasStats = fs.statSync(duasPath);
      duasFileSize = duasStats.size;
    } catch (e) {
      // File might not exist
    }
    
    try {
      const categoriesStats = fs.statSync(categoriesPath);
      categoriesFileSize = categoriesStats.size;
    } catch (e) {
      // File might not exist
    }
    
    return NextResponse.json({
      totalDuas,
      duasWithoutAudio,
      duasWithAudio: totalDuas - duasWithoutAudio,
      totalCategories,
      totalSubcategories,
      duasFileSize,
      categoriesFileSize,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
