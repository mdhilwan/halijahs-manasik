import { ChevronIcon, DownloadIcon, PlusIcon } from "./icons";
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

        {/* Per-page actions dropdown (Duas page) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            aria-label="Actions menu"
            aria-expanded={isDropdownOpen}
          >
            Actions
            <ChevronIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden">
              <button
                onClick={handleAddDua}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Add Dua
              </button>
              <button
                onClick={() => {
                  downloadDuas();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <DownloadIcon className="h-4 w-4" />
                Download duas.json
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
