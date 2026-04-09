"use client";
import { DuaManagementProvider } from "../../context/DuaManagementProvider";
import { DuaManagementHeader } from "../../component/DuaManagementHeader";
import { DuaFilters } from "../../component/DuaFilters";
import { DuaList } from "../../component/DuaList";
import { AddDuaModal } from "../../component/AddDuaModal";
import { BatchEditToolbar } from "../../component/BatchEditToolbar";
import { BatchCategoryModal } from "../../component/BatchCategoryModal";

export default function AppPage() {
  return (
    <DuaManagementProvider>
      <div className="min-h-screen bg-background">
        <DuaManagementHeader />

        <div className="mx-auto max-w-7xl px-6 py-6">
          <DuaFilters />
          <DuaList />
        </div>

        <AddDuaModal />
        <BatchEditToolbar />
        <BatchCategoryModal />
      </div>
    </DuaManagementProvider>
  );
}
