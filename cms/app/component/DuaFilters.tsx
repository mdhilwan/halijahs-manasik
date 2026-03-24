import { ChevronIcon, NoAudioIcon, SearchIcon } from "./icons";
import { useDuaManagement } from "../context/DuaManagementContext";

export function DuaFilters() {
  const {
    searchQuery,
    setSearchQuery,
    language,
    setLanguage,
    filterNoAudio,
    setFilterNoAudio,
    categories,
    selectedCategories,
    toggleCategory,
    expandedCategories,
    toggleExpanded,
    isFilterExpanded,
    setIsFilterExpanded,
    hasActiveFilters,
    clearAllFilters,
  } = useDuaManagement();

  return (
    <div className="mb-6 space-y-4">
      {/* Search and Language Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search duas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* No Audio Filter */}
          <button
            onClick={() => setFilterNoAudio(!filterNoAudio)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              filterNoAudio
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <NoAudioIcon className="h-4 w-4" />
            No Audio
          </button>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Display:</span>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  language === "en"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-secondary"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("my")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  language === "my"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-secondary"
                }`}
              >
                Malay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter - Multi Select with Subcategories */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
          >
            <ChevronIcon
              className={`h-4 w-4 transition-transform ${isFilterExpanded ? "rotate-180" : ""}`}
            />
            Filter by Categories
            {selectedCategories.length > 0 && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
        {isFilterExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map(category => (
            <div key={category.key} className="space-y-1.5 p-2 rounded-lg border border-border bg-card/50">
              {/* Parent Category */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleCategory(category.key, false)}
                  className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors text-left ${
                    selectedCategories.includes(category.key)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {language === "en" ? category.nameEn : category.nameMy}
                  {selectedCategories.includes(category.key) && (
                    <span className="ml-1 float-right">×</span>
                  )}
                </button>
                {category.subcategories.length > 0 && (
                  <button
                    onClick={() => toggleExpanded(category.key)}
                    className="shrink-0 p-1 rounded hover:bg-secondary transition-colors"
                    aria-label={expandedCategories.includes(category.key) ? "Collapse subcategories" : "Expand subcategories"}
                  >
                    <ChevronIcon
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        expandedCategories.includes(category.key) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Subcategories - Collapsible */}
              {category.subcategories.length > 0 && expandedCategories.includes(category.key) && (
                <div className="flex flex-col gap-1 pl-2 border-l-2 border-border">
                  {category.subcategories.map(sub => (
                    <button
                      key={sub.key}
                      onClick={() => toggleCategory(sub.key, true, category.key)}
                      className={`w-full rounded-md px-2 py-1 text-[11px] font-medium transition-colors text-left ${
                        selectedCategories.includes(sub.key)
                          ? "bg-primary/80 text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {language === "en" ? sub.nameEn : sub.nameMy}
                      {selectedCategories.includes(sub.key) && (
                        <span className="ml-1 float-right">×</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        )}
        {selectedCategories.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Showing duas that include ALL selected categories: {selectedCategories.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
