"use client";
import { useDuaManagement } from "../context/DuaManagementContext";
import { DuaFilters } from "./DuaFilters";
import { DuaList } from "./DuaList";
import { PreviewFrame } from "./PreviewFrame";

export function AppContent() {
  const { previewData } = useDuaManagement();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* Desktop Layout: Split Screen with Fixed Preview */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Side: Filters and List */}
          <div className="flex flex-col gap-4 overflow-y-auto pb-6 pr-4">
            <DuaFilters />
            <DuaList />
          </div>

          {/* Right Side: Preview */}
          <div className="flex flex-col gap-4 items-center pointer-events-auto">
            <div className="fixed">
              <PreviewFrame data={previewData} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout: Grid Only */}
      <div className="lg:hidden">
        <DuaFilters />
        <DuaList />
      </div>
    </div>
  );
}


