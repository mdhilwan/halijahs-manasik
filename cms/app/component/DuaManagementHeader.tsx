import Link from "next/link";
import { DownloadIcon, PlusIcon, TagIcon } from "./icons";
import { useDuaManagement } from "../context/DuaManagementContext";

export function DuaManagementHeader() {
  const { downloadDuas, setIsAddModalOpen } = useDuaManagement();

  return (
    <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20 shadow-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">App Management</h1>
          <p className="text-sm text-muted-foreground">Manage duas for Haji and Umrah Manasik App</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/app/categories"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <TagIcon className="h-4 w-4" />
            Categories
          </Link>
          <button
            onClick={downloadDuas}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <DownloadIcon className="h-4 w-4" />
            Download JSON
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Dua
          </button>
        </div>
      </div>
    </header>
  );
}
