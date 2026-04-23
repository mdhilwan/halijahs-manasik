import { NextResponse } from "next/server";
import { readDuas, writeDuas } from "../../../lib/data";

export async function POST(req: Request) {
  const { originalId, entryIds, newTitleEn, newTitleMy, categoryKeys } = await req.json();
  
  const data = readDuas();
  const originalIndex = data.findIndex((d: any) => d.id === originalId);
  
  if (originalIndex === -1) {
    return NextResponse.json({ error: "Original dua not found" }, { status: 404 });
  }
  
  const original = data[originalIndex];
  
  // Extract selected entries
  const selectedEntries = original.doa.filter((d: any) => entryIds.includes(d.id));
  const remainingEntries = original.doa.filter((d: any) => !entryIds.includes(d.id));
  
  if (selectedEntries.length === 0) {
    return NextResponse.json({ error: "No entries selected" }, { status: 400 });
  }
  
  if (remainingEntries.length === 0) {
    return NextResponse.json({ error: "Cannot move all entries - original prayer must keep at least one" }, { status: 400 });
  }
  
  // Generate new unique ID
  const maxId = Math.max(...data.map((d: any) => d.id));
  const newId = maxId + 1;
  
  // Create new dua with selected entries
  const newDua = {
    id: newId,
    titleEn: newTitleEn,
    titleMy: newTitleMy,
    categoryKey: categoryKeys,
    audio: null,
    doa: selectedEntries
  };
  
  // Update original dua - remove selected entries
  data[originalIndex] = {
    ...original,
    doa: remainingEntries
  };
  
  // Add new dua to data
  data.push(newDua);
  
  writeDuas(data);
  
  return NextResponse.json({ success: true, newId });
}
