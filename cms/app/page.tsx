"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [duas, setDuas] = useState<any[]>([]);
  const [titleEn, setTitleEn] = useState("");

  useEffect(() => {
    fetch("/api/duas").then(r => r.json()).then(setDuas);
  }, []);

  async function create() {
    await fetch("/api/duas", {
      method: "POST",
      body: JSON.stringify({ id: Date.now(), titleEn, doa: [] })
    });
    location.reload();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Dua Admin</h1>

      <div className="flex gap-3 mb-8 max-w-xl">
        <input
          placeholder="Title (English)"
          value={titleEn}
          onChange={e => setTitleEn(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={create}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3 max-w-xl">
        {duas.map(d => (
          <li
            key={d.id}
            className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <span className="font-medium text-gray-800">{d.titleEn}</span>
            <Link
              href={`/edit/${d.id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}