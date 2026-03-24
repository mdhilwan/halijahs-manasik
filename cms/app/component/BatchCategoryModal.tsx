import { CheckboxIcon, ChevronIcon } from "./icons";
import { useDuaManagement } from "../context/DuaManagementContext";

export function BatchCategoryModal() {
  const {
    isBatchModalOpen,
    setIsBatchModalOpen,
    batchMode,
    language,
    setLanguage,
    categories,
    batchCategorySelections,
    toggleBatchCategory,
    batchExpandedCategories,
    toggleBatchExpanded,
    selectedDuaIds,
    applyBatchUpdate,
    isBatchLoading,
  } = useDuaManagement();

  if (!isBatchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
      <div className="bg-card rounded-xl border border-border p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {batchMode === "add" ? "Add Categories" : "Remove Categories"}
            <span className="text-muted-foreground font-normal ml-2">
              ({selectedDuaIds.length} duas)
            </span>
          </h2>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                language === "en"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-secondary"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("my")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                language === "my"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-secondary"
              }`}
            >
              MY
            </button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {batchMode === "add"
            ? "Select categories to add to the selected duas. Existing categories will be preserved."
            : "Select categories to remove from the selected duas."}
        </p>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map(category => (
              <div key={category.key} className="space-y-1.5 p-2 rounded-lg border border-border bg-card/50">
                {/* Parent Category */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleBatchCategory(category.key)}
                    className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors text-left flex items-center gap-2 ${
                      batchCategorySelections.includes(category.key)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <CheckboxIcon checked={batchCategorySelections.includes(category.key)} small />
                    {language === "en" ? category.nameEn : category.nameMy}
                  </button>
                  {category.subcategories.length > 0 && (
                    <button
                      onClick={() => toggleBatchExpanded(category.key)}
                      className="shrink-0 p-1 rounded hover:bg-secondary transition-colors"
                    >
                      <ChevronIcon
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          batchExpandedCategories.includes(category.key) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {category.subcategories.length > 0 && batchExpandedCategories.includes(category.key) && (
                  <div className="flex flex-col gap-1 pl-2 border-l-2 border-border">
                    {category.subcategories.map(sub => (
                      <button
                        key={sub.key}
                        onClick={() => toggleBatchCategory(sub.key)}
                        className={`w-full rounded-md px-2 py-1 text-[11px] font-medium transition-colors text-left flex items-center gap-2 ${
                          batchCategorySelections.includes(sub.key)
                            ? "bg-primary/80 text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        <CheckboxIcon checked={batchCategorySelections.includes(sub.key)} small />
                        {language === "en" ? sub.nameEn : sub.nameMy}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {batchCategorySelections.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Selected: {batchCategorySelections.join(", ")}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
          <button
            onClick={() => setIsBatchModalOpen(false)}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={applyBatchUpdate}
            disabled={batchCategorySelections.length === 0 || isBatchLoading}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              batchMode === "add"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            }`}
          >
            {isBatchLoading
              ? "Applying..."
              : `${batchMode === "add" ? "Add" : "Remove"} to ${selectedDuaIds.length} duas`}
          </button>
        </div>
      </div>
    </div>
  );
}
