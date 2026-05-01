import fs from "fs";
import path from "path";

const duasPath = path.join(process.cwd(), "..", "assets", "data", "duas.json");
const categoriesPath = path.join(process.cwd(), "..", "assets", "data", "categories.json");
const aboutPath = path.join(process.cwd(), "..", "assets", "data", "about.json");

export interface Subcategory {
  key: string;
  nameEn: string;
  nameMy: string;
  order?: number;
}

export interface Dua {
  id: number;
  titleEn: string;
  titleMy: string;
  doa: {
    id: number;
    arabic: string;
    translationEn: string;
    translationMy: string;
  }[];
  categoryKey: string[];
  audio?: string;
  order?: Record<string, number>;
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

export interface AboutContributor {
  name: string;
  description: string;
}

export interface AboutSocialLink {
  href: string;
  icon: string;
}

export interface AboutData {
  about: string[];
  contributors: AboutContributor[];
  footer: {
    socialsIntro: string;
    socialLinks: AboutSocialLink[];
  };
  getInTouch?: {
    intro: string;
    emailAddress: string;
    emailText: string;
  };
  review?: {
    introLines: string[];
    links: {
      appStore: { href: string; label: string };
      googlePlay: { href: string; label: string };
    };
  };
  copyrightFooter?: string;
}

export function readDuas(): Dua[] {
  const raw = fs.readFileSync(duasPath, "utf-8");
  return JSON.parse(raw);
}

export function getCategoryByKey(key: string): Category | undefined {
  const data = readCategoriesData();
  return data.categories.find(c => c.key === key);
}

export function getDuasByCategory(categoryKey: string): Dua[] {
  const duas = readDuas();
  return duas.filter((d: Dua) => d.categoryKey.includes(categoryKey));
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

export function readAboutData(): AboutData {
  const raw = fs.readFileSync(aboutPath, "utf-8");
  return JSON.parse(raw);
}

export function writeAboutData(data: AboutData) {
  // Keep formatting stable for diffs.
  fs.writeFileSync(aboutPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export function getCategories(): Category[] {
  const data = readCategoriesData();
  return data.categories.sort((a, b) => a.key.localeCompare(b.key));
}

export function getCategoryKeys(): string[] {
  const data = readCategoriesData();
  return data.categories.map(c => c.key).sort();
}
