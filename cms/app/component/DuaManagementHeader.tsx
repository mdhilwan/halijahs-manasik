import Link from "next/link";
import { DownloadIcon, PlusIcon, TagIcon } from "./icons";
import { useDuaManagement } from "../context/DuaManagementContext";
import { useState, useRef, useEffect } from "react";

export function DuaManagementHeader() {
  const { downloadDuas, setIsAddModalOpen } = useDuaManagement();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddDua = () => {
    setIsAddModalOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <header className="border-b border-border bg-card px-6 py-4 sticky top-0 z-20 shadow-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">App Management</h1>
          <p className="text-sm text-muted-foreground">Manage duas for Haji and Umrah Manasik App</p>
        </div>
        
        {/* Desktop view - inline buttons */}
        <div className="hidden md:flex items-center gap-3">
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

        {/* Mobile view - dropdown menu */}
        <div className="md:hidden relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            aria-label="Actions menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50">
              <Link
                href="/app/categories"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors first:rounded-t-lg"
                onClick={() => setIsDropdownOpen(false)}
              >
                <TagIcon className="h-4 w-4" />
                Categories
              </Link>
              <button
                onClick={() => {
                  downloadDuas();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <DownloadIcon className="h-4 w-4" />
                Download JSON
              </button>
              <button
                onClick={handleAddDua}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-primary hover:bg-secondary transition-colors last:rounded-b-lg"
              >
                <PlusIcon className="h-4 w-4" />
                Add Dua
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
