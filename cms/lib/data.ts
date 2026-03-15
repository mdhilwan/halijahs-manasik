import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "..", "assets", "data", "duas.json");

export function readDuas() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

export function writeDuas(data: any) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export function getCategories(): string[] {
  const duas = readDuas();
  const categorySet = new Set<string>();
  
  for (const dua of duas) {
    if (dua.categoryKey && Array.isArray(dua.categoryKey)) {
      for (const category of dua.categoryKey) {
        categorySet.add(category);
      }
    }
  }
  
  return Array.from(categorySet).sort();
}
