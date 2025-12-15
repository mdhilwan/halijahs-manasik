import { NextResponse } from "next/server";
import { readDuas, writeDuas } from "../../../lib/data";

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