"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Scheherazade_New } from 'next/font/google';

const scheherazadeNew = Scheherazade_New({
  weight: "400",
  subsets: ["arabic"]
})

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [dua, setDua] = useState<any>(null);

  useEffect(() => {
    fetch("/api/duas").then(r => r.json()).then((data) => {
      setDua(data.find((d: any) => String(d.id) === id));
    });
  }, [id]);

  if (!dua) return null;

  async function save() {
    await fetch("/api/duas", {
      method: "PUT",
      body: JSON.stringify(dua)
    });
    router.push("/");
  }

  async function remove() {
    await fetch("/api/duas", {
      method: "DELETE",
      body: JSON.stringify({ id: dua.id })
    });
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">Edit Dua</h1>

      <div className="space-y-6 max-w-3xl">
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          <span>Title (English)</span>
          <input
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={dua.titleEn}
            onChange={e => setDua({ ...dua, titleEn: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          <span>Title (Malay)</span>
          <input
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={dua.titleMy}
            onChange={e => setDua({ ...dua, titleMy: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          <span>Category Keys (comma separated)</span>
          <input
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={dua.categoryKey?.join(", ") ?? ""}
            onChange={e =>
              setDua({
                ...dua,
                categoryKey: e.target.value
                  .split(",")
                  .map(v => v.trim())
                  .filter(Boolean)
              })
            }
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          <span>Audio Filename</span>
          <input
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={dua.audio ?? ""}
            onChange={e => setDua({ ...dua, audio: e.target.value })}
          />
        </label>

        <h3 className="pt-4 text-lg font-semibold text-gray-800">Doa Entries</h3>

        {dua.doa.map((d: any, index: number) => (
          <div
            key={d.id}
            className="rounded-lg border border-gray-300 bg-white p-4 space-y-3"
          >
            <strong>Doa #{index + 1}</strong>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              <span>Arabic</span>
              <textarea
                className={scheherazadeNew.className + " rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"}
                rows={5}
                value={d.arabic}
                onChange={e => {
                  const doa = [...dua.doa];
                  doa[index] = { ...doa[index], arabic: e.target.value };
                  setDua({ ...dua, doa });
                }}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              <span>Translation (English)</span>
              <textarea
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={4}
                value={d.translationEn}
                onChange={e => {
                  const doa = [...dua.doa];
                  doa[index] = { ...doa[index], translationEn: e.target.value };
                  setDua({ ...dua, doa });
                }}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              <span>Translation (Malay)</span>
              <textarea
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={4}
                value={d.translationMy}
                onChange={e => {
                  const doa = [...dua.doa];
                  doa[index] = { ...doa[index], translationMy: e.target.value };
                  setDua({ ...dua, doa });
                }}
              />
            </label>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={save}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save
        </button>

        <button
          onClick={remove}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete
        </button>

        <Link
          href={"/"}
          className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Back
        </Link>
      </div>
    </main>
  );
}
