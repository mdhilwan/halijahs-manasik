"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

interface Subcategory {
  key: string;
  nameEn: string;
  nameMy: string;
  order?: number;
}

interface Category {
  key: string;
  nameEn: string;
  nameMy: string;
  global?: boolean;
  subcategories: Subcategory[];
}

interface Dua {
  id: number;
  titleEn: string;
  titleMy: string;
  categoryKey: string[];
  order?: Record<string, number>;
}

type ReorderItem = {
  type: "dua" | "subcategory";
  id: string;
  nameEn: string;
  nameMy: string;
  order: number;
};

export default function CategoryReorderPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key: categoryKey } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<ReorderItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [categoryKey]);

  async function fetchData() {
    setLoading(true);
    try {
      const [categoriesRes, duasRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/duas"),
      ]);
      const categories: Category[] = await categoriesRes.json();
      const duas: Dua[] = await duasRes.json();

      const cat = categories.find((c) => c.key === categoryKey);
      if (!cat) {
        setLoading(false);
        return;
      }
      setCategory(cat);

      // Build combined list of subcategories and duas
      const combinedItems: ReorderItem[] = [];

      // Add subcategories
      cat.subcategories.forEach((sub, index) => {
        combinedItems.push({
          type: "subcategory",
          id: sub.key,
          nameEn: sub.nameEn,
          nameMy: sub.nameMy,
          order: sub.order ?? index + 1000, // Default order for subcategories
        });
      });

      // Add duas that belong to this category
      const categoryDuas = duas.filter((d) =>
        d.categoryKey.includes(categoryKey)
      );
      categoryDuas.forEach((dua, index) => {
        combinedItems.push({
          type: "dua",
          id: String(dua.id),
          nameEn: dua.titleEn,
          nameMy: dua.titleMy,
          order: dua.order?.[categoryKey] ?? index + 2000, // Default order for duas
        });
      });

      // Sort by order
      combinedItems.sort((a, b) => a.order - b.order);

      setItems(combinedItems);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    const newItems = Array.from(items);
    const [removed] = newItems.splice(sourceIndex, 1);
    newItems.splice(destIndex, 0, removed);

    // Update order values based on new positions
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setItems(updatedItems);
    setHasChanges(true);
  }

  async function saveOrder() {
    if (!category) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/categories/${categoryKey}/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, index) => ({
            type: item.type,
            id: item.id,
            order: index,
          })),
        }),
      });

      if (response.ok) {
        setHasChanges(false);
      } else {
        alert("Failed to save order. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save order:", error);
      alert("Failed to save order. Please try again.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-destructive">Category not found</p>
          <Link
            href="/categories"
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Back to Categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/categories"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Reorder: {category.nameEn}
              </h1>
              <p className="text-sm text-muted-foreground">
                Drag items to reorder duas and subcategories
              </p>
            </div>
          </div>
          <button
            onClick={saveOrder}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <SpinnerIcon className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4" />
                Save Order
              </>
            )}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 flex gap-4">
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-2xl font-semibold text-foreground">
              {items.filter((i) => i.type === "dua").length}
            </p>
            <p className="text-sm text-muted-foreground">Duas</p>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-2xl font-semibold text-foreground">
              {items.filter((i) => i.type === "subcategory").length}
            </p>
            <p className="text-sm text-muted-foreground">Subcategories</p>
          </div>
        </div>

        {hasChanges && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
            You have unsaved changes. Click "Save Order" to persist your
            changes.
          </div>
        )}

        {/* Reorder List */}
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FolderIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No items in this category</p>
            <p className="text-sm mt-1">
              Add duas or subcategories to this category first
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="reorder-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={`${item.type}-${item.id}`}
                      draggableId={`${item.type}-${item.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-3 rounded-lg border bg-card p-4 transition-shadow ${
                            snapshot.isDragging
                              ? "border-primary shadow-lg"
                              : "border-border"
                          }`}
                        >
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="flex items-center justify-center w-8 h-8 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-grab active:cursor-grabbing"
                          >
                            <GripIcon className="h-5 w-5" />
                          </div>

                          {/* Order Number */}
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                            {index + 1}
                          </div>

                          {/* Type Icon */}
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                              item.type === "dua"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-blue-500/10 text-blue-600"
                            }`}
                          >
                            {item.type === "dua" ? (
                              <BookIcon className="h-4 w-4" />
                            ) : (
                              <FolderIcon className="h-4 w-4" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground truncate">
                                {item.nameEn}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  item.type === "dua"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-blue-500/10 text-blue-600"
                                }`}
                              >
                                {item.type === "dua" ? "Dua" : "Subcategory"}
                              </span>
                            </div>
                            {item.nameMy !== item.nameEn && (
                              <p className="text-sm text-muted-foreground truncate">
                                {item.nameMy}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </main>
  );
}

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function GripIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01"
      />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );
}
