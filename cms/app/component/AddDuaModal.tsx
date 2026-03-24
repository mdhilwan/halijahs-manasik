import React from "react";
import { useDuaManagement } from "../context/DuaManagementContext";

export function AddDuaModal() {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    newDuaTitle,
    setNewDuaTitle,
    createDua,
  } = useDuaManagement();

  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
      <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">Add New Dua</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Title (English) <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={newDuaTitle.en}
              onChange={e => setNewDuaTitle(prev => ({ ...prev, en: e.target.value }))}
              placeholder="Enter English title"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Title (Malay)
            </label>
            <input
              type="text"
              value={newDuaTitle.my}
              onChange={e => setNewDuaTitle(prev => ({ ...prev, my: e.target.value }))}
              placeholder="Enter Malay title"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setIsAddModalOpen(false);
              setNewDuaTitle({ en: "", my: "" });
            }}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={createDua}
            disabled={!newDuaTitle.en.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Dua
          </button>
        </div>
      </div>
    </div>
  );
}
