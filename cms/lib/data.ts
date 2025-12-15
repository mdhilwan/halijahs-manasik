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