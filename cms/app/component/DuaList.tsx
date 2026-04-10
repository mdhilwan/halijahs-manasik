import Link from "next/link";
import { AudioIcon, CheckIcon, CheckboxIcon, NoAudioIcon, SearchIcon } from "./icons";
import { useDuaManagement } from "../context/DuaManagementContext";

export function DuaList() {
  const {
    filteredDuas,
    language,
    selectedDuaIds,
    toggleDuaSelection,
    allVisibleSelected,
    selectAllVisible,
    duas,
    selectedCategories,
    filterNoAudio,
  } = useDuaManagement();

  return (
    <>
      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredDuas.length} of {duas.length} duas
          {selectedCategories.length > 0 && (
            <span> with categories: <span className="font-medium capitalize text-foreground">{selectedCategories.join(", ")}</span></span>
          )}
          {filterNoAudio && <span className="font-medium text-foreground"> (No audio only)</span>}
        </div>
        <button
          onClick={selectAllVisible}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          <CheckboxIcon checked={allVisibleSelected} />
          {allVisibleSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Duas List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
        {filteredDuas.map(dua => {
          const isSelected = selectedDuaIds.includes(dua.id);
          return (
            <div
              key={dua.id}
              onClick={() => toggleDuaSelection(dua.id)}
              className={`group rounded-xl border p-4 transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                  : "border-border bg-card hover:shadow-md hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Selection indicator */}
                  <div className={`shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30"
                  }`}>
                    {isSelected && (
                      <CheckIcon className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {language === "en" ? dua.titleEn : dua.titleMy}
                    </h3>
                    {language === "en" && dua.titleMy && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{dua.titleMy}</p>
                    )}
                    {language === "my" && dua.titleEn && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{dua.titleEn}</p>
                    )}
                  </div>
                </div>
                <Link
                  href={`/app/edit/${dua.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Edit
                </Link>
              </div>

              {dua.categoryKey && dua.categoryKey.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 ml-8">
                  {dua.categoryKey.slice(0, 3).map(cat => (
                    <span
                      key={cat}
                      className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize"
                    >
                      {cat}
                    </span>
                  ))}
                  {dua.categoryKey.length > 3 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      +{dua.categoryKey.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground ml-8">
                <span>{dua.doa?.length || 0} entries</span>
                {dua.audio ? (
                  <>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1">
                      <AudioIcon className="h-3 w-3" />
                      Has audio
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1 text-destructive/70">
                      <NoAudioIcon className="h-3 w-3" />
                      No audio
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDuas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No duas found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}
    </>
  );
}
