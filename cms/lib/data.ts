import fs from "fs";
import path from "path";

const duasPath = path.join(process.cwd(), "..", "assets", "data", "duas.json");
const categoriesPath = path.join(process.cwd(), "..", "assets", "data", "categories.json");

export interface Subcategory {
  key: string;
  nameEn: string;
  nameMy: string;
}

export interface Category {
  key: string;
  nameEn: string;
  nameMy: string;
  global?: boolean;
  subcategories: Subcategory[];
}

export interface CategoriesData {
  categories: Category[];
}

export function readDuas() {
  const raw = fs.readFileSync(duasPath, "utf-8");
  return JSON.parse(raw);
}

export function writeDuas(data: any) {
  fs.writeFileSync(duasPath, JSON.stringify(data, null, 2));
}

export function readCategoriesData(): CategoriesData {
  const raw = fs.readFileSync(categoriesPath, "utf-8");
  return JSON.parse(raw);
}

export function writeCategoriesData(data: CategoriesData) {
  fs.writeFileSync(categoriesPath, JSON.stringify(data, null, 2));
}

export function getCategories(): Category[] {
  const data = readCategoriesData();
  return data.categories.sort((a, b) => a.key.localeCompare(b.key));
}

export function getCategoryKeys(): string[] {
  const data = readCategoriesData();
  return data.categories.map(c => c.key).sort();
}
