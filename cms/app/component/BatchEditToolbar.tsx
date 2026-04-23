import { MinusIcon, PlusIcon } from "./icons";
import { useDuaManagement } from "../context/DuaManagementContext";

export function BatchEditToolbar() {
  const {
    selectedDuaIds,
    clearDuaSelection,
    setBatchMode,
    setIsBatchModalOpen,
  } = useDuaManagement();

  if (selectedDuaIds.length === 0) return null;

  const openBatchModal = (mode: "add" | "remove") => {
    setBatchMode(mode);
    setIsBatchModalOpen(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">
            {selectedDuaIds.length} selected
          </span>
          <button
            onClick={clearDuaSelection}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openBatchModal("add")}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Categories
          </button>
          <button
            onClick={() => openBatchModal("remove")}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <MinusIcon className="h-4 w-4" />
            Remove Categories
          </button>
        </div>
      </div>
    </div>
  );
}
