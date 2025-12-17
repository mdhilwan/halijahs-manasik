"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Scheherazade_New } from 'next/font/google';
import DoaPreview from "../../component/doa-preview";

const scheherazadeNew = Scheherazade_New({
  weight: "400",
  subsets: ["arabic"]
})

const categoryOptions = [
  "talbiyah", "ihram", "umrah", "haji", "masjidil haram", "tawaf", "niat", "zam-zam", "sa'i", "tahalul", "tawaf wadak", "madinah", "travel"
];

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [dua, setDua] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/duas").then(r => r.json()).then((data) => {
      const foundDua = data.find((d: any) => String(d.id) === id);
      setDua(foundDua);
      setSelectedCategories(foundDua?.categoryKey ?? []);
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

  function toggleCategory(category: string) {
    let newSelectedCategories: string[];
    if (selectedCategories.includes(category)) {
      newSelectedCategories = selectedCategories.filter(c => c !== category);
    } else {
      newSelectedCategories = [...selectedCategories, category];
    }
    setSelectedCategories(newSelectedCategories);
    setDua({...dua, categoryKey: newSelectedCategories});
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">Edit Dua</h1>

      <div className="flex gap-3">
        <div className="space-y-6 max-w-xl">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            <span>Title (English)</span>
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={dua.titleEn}
              onChange={e => setDua({...dua, titleEn: e.target.value})}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            <span>Title (Malay)</span>
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={dua.titleMy}
              onChange={e => setDua({...dua, titleMy: e.target.value})}
            />
          </label>

          <fieldset className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            <legend>Category Keys</legend>
            <div className="flex flex-wrap gap-3">
              {categoryOptions.map(category => (
                <label key={category} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="capitalize">{category}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            <span>Audio Filename</span>
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={dua.audio ?? ""}
              onChange={e => setDua({...dua, audio: e.target.value})}
            />
          </label>

          <h3 className="pt-4 text-lg font-semibold text-gray-800">Doa Entries</h3>

          <button
            type="button"
            onClick={() => {
              const doa = [
                ...dua.doa,
                {
                  id: Date.now(),
                  arabic: "",
                  translationEn: "",
                  translationMy: ""
                }
              ];
              setDua({...dua, doa});
            }}
            className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
          >
            + Add Doa
          </button>


          {dua.doa.map((d: any, index: number) => (
            <div
              key={d.id}
              className="rounded-lg border border-gray-300 bg-white p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <strong>Doa #{index + 1}</strong>
                <button
                  type="button"
                  onClick={() => {
                    const doa = dua.doa.filter((_: any, i: number) => i !== index);
                    setDua({...dua, doa});
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                <span>Arabic</span>
                <textarea
                  className={scheherazadeNew.className + " rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"}
                  rows={5}
                  value={d.arabic}
                  onChange={e => {
                    const doa = [...dua.doa];
                    doa[index] = {...doa[index], arabic: e.target.value};
                    setDua({...dua, doa});
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
                    doa[index] = {...doa[index], translationEn: e.target.value};
                    setDua({...dua, doa});
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
                    doa[index] = {...doa[index], translationMy: e.target.value};
                    setDua({...dua, doa});
                  }}
                />
              </label>
            </div>
          ))}

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
