import { NextResponse } from "next/server";
import { getCategories, readCategoriesData, writeCategoriesData, Category } from "../../../lib/data";

export async function GET() {
  return NextResponse.json(getCategories());
}

export async function POST(request: Request) {
  const newCategory: Category = await request.json();
  const data = readCategoriesData();
  
  // Check if category key already exists
  if (data.categories.some(c => c.key === newCategory.key)) {
    return NextResponse.json({ error: "Category key already exists" }, { status: 400 });
  }
  
  data.categories.push({
    key: newCategory.key,
    nameEn: newCategory.nameEn,
    nameMy: newCategory.nameMy,
    global: newCategory.global,
    subcategories: newCategory.subcategories || []
  });
  
  writeCategoriesData(data);
  return NextResponse.json(newCategory);
}

export async function PUT(request: Request) {
  const updatedCategory: Category = await request.json();
  const data = readCategoriesData();
  
  const index = data.categories.findIndex(c => c.key === updatedCategory.key);
  if (index === -1) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  
  data.categories[index] = updatedCategory;
  writeCategoriesData(data);
  return NextResponse.json(updatedCategory);
}

export async function DELETE(request: Request) {
  const { key } = await request.json();
  const data = readCategoriesData();
  
  const index = data.categories.findIndex(c => c.key === key);
  if (index === -1) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  
  data.categories.splice(index, 1);
  writeCategoriesData(data);
  return NextResponse.json({ success: true });
}
