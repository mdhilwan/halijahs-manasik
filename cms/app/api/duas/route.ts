import { NextResponse } from "next/server";
import { readDuas, writeDuas } from "../../lib/data";

export async function GET() {
  return NextResponse.json(readDuas());
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = readDuas();
  data.push(body);
  writeDuas(data);
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const data = readDuas();
  const index = data.findIndex((d: any) => d.id === body.id);
  data[index] = body;
  writeDuas(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const data = readDuas().filter((d: any) => d.id !== id);
  writeDuas(data);
  return NextResponse.json({ success: true });
}

// Bulk update categories for multiple duas
export async function PATCH(req: Request) {
  const { ids, categoryKeys, mode } = await req.json();
  // mode: "add" | "remove"
  const data = readDuas();
  
  data.forEach((dua: any) => {
    if (ids.includes(dua.id)) {
      if (!dua.categoryKey) {
        dua.categoryKey = [];
      }
      if (mode === "add") {
        // Merge: add new categories while keeping existing
        const merged = [...new Set([...dua.categoryKey, ...categoryKeys])];
        dua.categoryKey = merged;
      } else {
        // Remove: filter out the specified categories
        dua.categoryKey = dua.categoryKey.filter((k: string) => !categoryKeys.includes(k));
      }
    }
  });
  
  writeDuas(data);
  return NextResponse.json({ success: true });
}
