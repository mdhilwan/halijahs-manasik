"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDuaManagement } from "../../../context/DuaManagementContext";

interface Subcategory {
  key: string;
  nameEn: string;
  nameMy: string;
}

interface Category {
  key: string;
  nameEn: string;
  nameMy: string;
  global?: boolean;
  subcategories: Subcategory[];
}

type ModalMode = "add-category" | "edit-category" | "add-subcategory" | "edit-subcategory" | null;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { downloadCategories } = useDuaManagement();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [parentCategoryKey, setParentCategoryKey] = useState<string | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [formKey, setFormKey] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formNameMy, setFormNameMy] = useState("");
  const [formGlobal, setFormGlobal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }

  function resetForm() {
    setFormKey("");
    setFormNameEn("");
    setFormNameMy("");
    setFormGlobal(false);
    setEditingCategory(null);
    setEditingSubcategory(null);
    setParentCategoryKey(null);
    setModalMode(null);
  }

  function openAddCategory() {
    resetForm();
    setModalMode("add-category");
  }

  function openEditCategory(category: Category) {
    setFormKey(category.key);
    setFormNameEn(category.nameEn);
    setFormNameMy(category.nameMy);
    setFormGlobal(category.global ?? false);
    setEditingCategory(category);
    setModalMode("edit-category");
  }

  function openAddSubcategory(parentKey: string) {
    resetForm();
    setParentCategoryKey(parentKey);
    setModalMode("add-subcategory");
  }

  function openEditSubcategory(parentKey: string, subcategory: Subcategory) {
    setFormKey(subcategory.key);
    setFormNameEn(subcategory.nameEn);
    setFormNameMy(subcategory.nameMy);
    setParentCategoryKey(parentKey);
    setEditingSubcategory(subcategory);
    setModalMode("edit-subcategory");
  }

  async function saveCategory() {
    if (!formKey.trim() || !formNameEn.trim()) return;

    const categoryData: Category = {
      key: formKey.trim().toLowerCase(),
      nameEn: formNameEn.trim(),
      nameMy: formNameMy.trim() || formNameEn.trim(),
      global: formGlobal || undefined,
      subcategories: editingCategory?.subcategories ?? []
    };

    if (modalMode === "add-category") {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData)
      });
    } else if (modalMode === "edit-category" && editingCategory) {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData)
      });
    }

    resetForm();
    fetchCategories();
  }

  async function deleteCategory(key: string) {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;

    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key })
    });

    fetchCategories();
  }

  async function saveSubcategory() {
    if (!formKey.trim() || !formNameEn.trim() || !parentCategoryKey) return;

    const parentCategory = categories.find(c => c.key === parentCategoryKey);
    if (!parentCategory) return;

    const subcategoryData: Subcategory = {
      key: formKey.trim().toLowerCase(),
      nameEn: formNameEn.trim(),
      nameMy: formNameMy.trim() || formNameEn.trim()
    };

    let updatedSubcategories: Subcategory[];

    if (modalMode === "add-subcategory") {
      updatedSubcategories = [...parentCategory.subcategories, subcategoryData];
    } else if (modalMode === "edit-subcategory" && editingSubcategory) {
      updatedSubcategories = parentCategory.subcategories.map(s => 
        s.key === editingSubcategory.key ? subcategoryData : s
      );
    } else {
      return;
    }

    await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parentCategory,
        subcategories: updatedSubcategories
      })
    });

    resetForm();
    fetchCategories();
  }

  async function deleteSubcategory(parentKey: string, subcategoryKey: string) {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;

    const parentCategory = categories.find(c => c.key === parentKey);
    if (!parentCategory) return;

    const updatedSubcategories = parentCategory.subcategories.filter(s => s.key !== subcategoryKey);

    await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parentCategory,
        subcategories: updatedSubcategories
      })
    });

    fetchCategories();
  }

  const isCategory = modalMode === "add-category" || modalMode === "edit-category";
  const isSubcategory = modalMode === "add-subcategory" || modalMode === "edit-subcategory";
  const isEditing = modalMode === "edit-category" || modalMode === "edit-subcategory";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
            <p className="text-sm text-muted-foreground">Manage categories and subcategories</p>
          </div>
          <div className="relative" ref={actionsRef}>
            <button
              type="button"
              onClick={() => setIsActionsOpen(v => !v)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              aria-label="Actions menu"
              aria-expanded={isActionsOpen}
            >
              Actions
              <ChevronIcon className={`h-4 w-4 transition-transform ${isActionsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isActionsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => {
                    downloadCategories(categories);
                    setIsActionsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download categories.json
                </button>
                <button
                  onClick={() => {
                    openAddCategory();
                    setIsActionsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Category
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 flex gap-4">
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-2xl font-semibold text-foreground">{categories.length}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-2xl font-semibold text-foreground">
              {categories.reduce((acc, c) => acc + c.subcategories.length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Subcategories</p>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {categories.map(category => (
            <div
              key={category.key}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.key ? null : category.key)}
                    className="flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <ChevronIcon 
                      className={`h-4 w-4 transition-transform ${expandedCategory === category.key ? 'rotate-90' : ''}`} 
                    />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{category.nameEn}</span>
                      {category.nameMy !== category.nameEn && (
                        <span className="text-sm text-muted-foreground">/ {category.nameMy}</span>
                      )}
                      {category.global && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          Global
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Key: <code className="bg-muted px-1 rounded">{category.key}</code>
                      {category.subcategories.length > 0 && (
                        <span className="ml-2">{category.subcategories.length} subcategories</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/app/categories/${encodeURIComponent(category.key)}`}
                    className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                  >
                    <ReorderIcon className="h-3 w-3" />
                    Reorder
                  </Link>
                  <button
                    onClick={() => openAddSubcategory(category.key)}
                    className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <PlusIcon className="h-3 w-3" />
                    Add Sub
                  </button>
                  <button
                    onClick={() => openEditCategory(category)}
                    className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <EditIcon className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category.key)}
                    className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <TrashIcon className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {expandedCategory === category.key && (
                <div className="border-t border-border bg-muted/30">
                  {category.subcategories.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <p className="text-sm">No subcategories</p>
                      <button
                        onClick={() => openAddSubcategory(category.key)}
                        className="mt-2 text-xs text-primary hover:text-primary/80 font-medium"
                      >
                        Add the first subcategory
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 pl-12 space-y-2">
                      {category.subcategories.map(sub => (
                        <div
                          key={sub.key}
                          className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{sub.nameEn}</span>
                              {sub.nameMy !== sub.nameEn && (
                                <span className="text-xs text-muted-foreground">/ {sub.nameMy}</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Key: <code className="bg-muted px-1 rounded">{sub.key}</code>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditSubcategory(category.key, sub)}
                              className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteSubcategory(category.key, sub.key)}
                              className="rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {categories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FolderIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No categories yet</p>
              <p className="text-sm mt-1">Click &quot;Add Category&quot; to create your first category</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {modalMode === "add-category" && "Add New Category"}
              {modalMode === "edit-category" && "Edit Category"}
              {modalMode === "add-subcategory" && "Add Subcategory"}
              {modalMode === "edit-subcategory" && "Edit Subcategory"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Key <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formKey}
                  onChange={e => setFormKey(e.target.value)}
                  placeholder="e.g., arafah"
                  disabled={isEditing}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Unique identifier (lowercase, no spaces recommended)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Name (English) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formNameEn}
                  onChange={e => setFormNameEn(e.target.value)}
                  placeholder="e.g., Arafah"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Name (Malay)
                </label>
                <input
                  type="text"
                  value={formNameMy}
                  onChange={e => setFormNameMy(e.target.value)}
                  placeholder="e.g., Arafah"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {isCategory && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="global"
                    checked={formGlobal}
                    onChange={e => setFormGlobal(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <label htmlFor="global" className="text-sm text-foreground">
                    Global category
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={resetForm}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isSubcategory ? saveSubcategory : saveCategory}
                disabled={!formKey.trim() || !formNameEn.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function ReorderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}
