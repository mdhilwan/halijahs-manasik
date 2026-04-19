"use client";
import { DuaManagementProvider } from "../../context/DuaManagementProvider";
import { DuaManagementHeader } from "../../component/DuaManagementHeader";
import { AppContent } from "../../component/AppContent";
import { AddDuaModal } from "../../component/AddDuaModal";
import { BatchEditToolbar } from "../../component/BatchEditToolbar";
import { BatchCategoryModal } from "../../component/BatchCategoryModal";
export default function AppPage() {
  return (
    <DuaManagementProvider>
      <div className="min-h-screen bg-background">
        <DuaManagementHeader />
        <AppContent />
        <AddDuaModal />
        <BatchEditToolbar />
        <BatchCategoryModal />
      </div>
    </DuaManagementProvider>
  );
}
