"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DoaPreview from "./component/doa-preview";

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

  function downloadDuas() {
    const blob = new Blob([JSON.stringify(duas, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "duas.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Dua Admin</h1>

      <div className="flex gap-3">
        <div className="max-w-xl">
          <div className="flex gap-3 mb-8">
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

          <ul className="space-y-3">
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

          <div className="mt-6">
            <button
              onClick={downloadDuas}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
            >
              Download duas.json
            </button>
          </div>
        </div>
        <div className="flex grow justify-center">
          <div className="relative">
            <div className="sticky top-4">
              <DoaPreview titleEn={'hello'} titleMy={'selamat'}/>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}