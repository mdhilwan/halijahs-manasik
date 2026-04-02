# Architecture Overview - After Refactoring

## Component Hierarchy

```
App
├── HomeStack
│   ├── index.tsx (HomeScreen)
│   │   ├── useLanguage()
│   │   ├── useFontLoader()
│   │   ├── useDuaLoader()
│   │   └── useFilteredButtons()
│   │
│   ├── duaList.tsx (DuaListScreen)
│   │   ├── useLanguage()
│   │   ├── useFontLoader()
│   │   ├── useSortedDuasAndCategories()
│   │   └── useNavigation()
│   │
│   └── duaDetail.tsx (DuaDetailScreen)
│       ├── useLanguage()
│       ├── useFontSize()
│       ├── useFavourite()
│       ├── useNavigation()
│       └── Children:
│           ├── ArabicText component
│           ├── TranslationText component
│           └── DuaPlayer component
```

## Data Flow

### HomeScreen Flow
```
User Action: Select Category
     ↓
handleCategoryPress()
     ↓
useDuaLoader.loadDuas(category)
     ↓
Filter duas + include subcategories
     ↓
if length === 1 → Navigate to duaDetail
else → Navigate to duaList
```

### DuaListScreen Flow
```
Route Params: { category, duas }
     ↓
useMemo: Filter duas for category
     ↓
useSortedDuasAndCategories: Sort items
     ↓
Render list with memoized sorting
     ↓
On item press → Navigate to duaDetail or nested duaList
```

### DuaDetailScreen Flow
```
Route Params: { selectedDua: { curr, duas } }
     ↓
useFavourite(duaId): Check/toggle favorite
     ↓
Display dua with:
- ArabicText (conditional on duaHidden)
- TranslationText (conditional on translationHidden)
- DuaPlayer (audio control)
- Font size controls
```

## State Management

### Global State (Contexts)
```
LanguageContext
├── language: 'en' | 'my'
└── setLanguage: (lang) => void
    └── Persists to AsyncStorage

FontSettingsContext
├── translationFontSize: number
├── arabicFontSize: number
├── duaHidden: boolean
├── translationHidden: boolean
├── showSettings: boolean
└── All persisted to AsyncStorage

AudioContext
├── [Audio playback state]
└── [Audio controls]
```

### Local State (Component)
```
HomeScreen
└── mode: 'hajj' | 'umrah'
    └── Controls button filtering

DuaDetailScreen
└── selectedDua: SelectedDuaType
    └── Initialized from route params
```

### Custom Hook State
```
useFavourite
├── isFavourited: boolean
├── toggleFavourite: () => Promise<void>
└── isLoading: boolean
    └── Persists to AsyncStorage

useDuaLoader
└── loadDuas: (category) => DuaType[]
    └── Filters & returns duas
```

## Hook Dependency Graph

```
HomeScreen
├── useFontLoader
│   └── useFonts (expo-font)
├── useDuaLoader
│   └── duasJson, categoriesData
├── useFilteredButtons
│   └── Depends on mode state
└── useLanguage
    └── LanguageContext

DuaListScreen
├── useFontLoader
│   └── useFonts (expo-font)
├── useSortedDuasAndCategories
│   └── Memoized sorting logic
└── useLanguage
    └── LanguageContext

DuaDetailScreen
├── useFavourite
│   └── AsyncStorage
├── useFontSize
│   └── FontSettingsContext
└── useLanguage
    └── LanguageContext
```

## Data Structures

### Button (from home-screen.ts)
```typescript
type ButtonType = {
  key: string;
  bgImg?: any;
}

const HOME_SCREEN_BUTTONS: ButtonType[] = [
  { key: 'ihram', bgImg: require(...) },
  // ... 13 more buttons
  { key: 'stoning', bgImg: require(...) }
]

const HAJJ_ONLY_SECTIONS = ['arafah', 'mina', 'muzdalifah', 'stoning']
```

### Dua (from config/types.ts)
```typescript
type DuaType = {
  id: number;
  titleEn: string;
  titleMy: string;
  doa: DuaEngMalayArabicType[];
  categoryKey: string[];
  order: Record<string, number>;
  audio?: string | null;
}

type DuaEngMalayArabicType = {
  id: number;
  arabic: string;
  translationMy: string | string[];
  translationEn: string | string[];
}
```

### Selected Dua
```typescript
type SelectedDuaType = undefined | {
  curr: number | undefined;
  duas: DuaType[];
}
```

### Category
```typescript
type CategoryType = {
  key: string;
  nameEn: string;
  nameMy: string;
  subcategories?: {
    key: string;
    nameEn: string;
    nameMy: string;
  }[];
  order: number;
  global?: boolean;
}
```

## Navigation Flow

```
HomeScreen
    ↓
    ├─→ [Single Dua] → DuaDetailScreen
    │
    └─→ [Multiple Duas] → DuaListScreen
         ↓
         ├─→ DuaDetailScreen
         │
         └─→ DuaListScreen (nested)
              └─→ DuaDetailScreen
```

## AsyncStorage Schema

```
AsyncStorage
├── app_language: 'en' | 'my'
├── app_sizes: {
│   translationFontSize: number,
│   arabicFontSize: number
│ }
└── favourited_duas: number[]  // array of dua IDs
```

## Performance Optimizations

### Memoization Strategy
```
HomeScreen
├── getCategoryName: useCallback
│   └── Deps: [language]
├── handleCategoryPress: useCallback
│   └── Deps: [loadDuas, navigation]
├── toggleMode: useCallback
│   └── Deps: []
└── filteredButtons = useFilteredButtons(mode)
    └── Uses useMemo internally
        └── Deps: [mode]

DuaListScreen
├── handleBack: useCallback
│   └── Deps: [navigation]
├── handleSelectDua: useCallback
│   └── Deps: [navigation, initialDuas]
├── handleNavigateToSubcategory: useCallback
│   └── Deps: [navigation, initialDuas]
├── subcategoryObj: useMemo
│   └── Deps: [category]
├── combinedDuasAndSubcategories: useMemo
│   └── Deps: [initialDuas, category, subcategoryObj]
└── sortedItems = useSortedDuasAndCategories(...)
    └── Uses useMemo internally
        └── Deps: [items, categoryKey]

DuaDetailScreen
└── Hooks handle their own memoization
    ├── useFavourite
    └── useLanguage
```

### Key Props Strategy
```
HomeScreen
└── {filteredButtons.map((btn) => (
      <TouchableOpacity key={btn.key} ... />
    ))}
    // Using unique identifier (btn.key) instead of index

DuaListScreen
└── {sortedItems.map((item, index) => (
      <TouchableOpacity key={`${item.key}-${index}`} ... />
    ))}
    // Combined unique ID with index for safety
```

## Comparison: Before vs After

### Before
```
Components (3)
├── Local font loading (3x)
├── Inline business logic
├── Mixed concerns
├── No memoization
└── Limited accessibility

└── Total: Monolithic, hard to test
```

### After
```
Components (3)          Custom Hooks (4)      Constants (1)
├── Clean UI logic      ├── useFontLoader     └── HOME_SCREEN_BUTTONS
├── Prop interfaces     ├── useFavourite      └── useFilteredButtons
├── Accessibility       ├── useDuaLoader      └── Type definitions
└── Separated concerns  ├── useSortedDuas...

└── Total: Modular, testable, maintainable
```

## Module Dependency Graph

```
app/(tabs)/home/
├── index.tsx
│   ├── constants/home-screen.ts
│   │   └── hooks/useSortedDuasAndCategories.ts
│   ├── hooks/useFontLoader.ts
│   ├── hooks/useDuaLoader.ts
│   │   └── assets/data/duas.json
│   │   └── assets/data/categories.json
│   ├── contexts/LanguageContext.tsx
│   └── constants/theme.ts
│
├── duaList.tsx
│   ├── hooks/useFontLoader.ts
│   ├── hooks/useSortedDuasAndCategories.ts
│   ├── contexts/LanguageContext.tsx
│   ├── assets/data/categories.json
│   ├── constants/theme.ts
│   └── config/types.ts
│
└── duaDetail.tsx
    ├── hooks/useFavourite.ts
    │   └── @react-native-async-storage/async-storage
    ├── contexts/FontSettingsContext.tsx
    ├── contexts/LanguageContext.tsx
    ├── config/types.ts
    └── assets/data/duas.json
```

---

**Architecture Type**: Feature-based, Hook-oriented, Modular
**Pattern**: Container Components with Custom Hooks
**State Management**: Context API + AsyncStorage
**Performance**: Memoized computations and callbacks

