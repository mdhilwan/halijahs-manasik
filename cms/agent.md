# CMS (Next.js) – Agent Notes

This folder (`cms/`) is a **Next.js App Router** admin panel used to manage the content for the Manasik app (duas + categories). It’s a separate Next.js project inside the monorepo.

## Tech stack / runtime
- **Next.js** (App Router) – `next@^15.x`
- **React** – `react@^19.x`
- **Tailwind CSS** (utility classes)
- **Supabase** auth (SSR helpers)

Key scripts:
- `npm run dev` – local dev
- `npm run build` – production build

> Note: this repo has multiple lockfiles (root + `cms/`). Next may warn about `outputFileTracingRoot` during builds.

## High-level architecture
- **App Router** lives under `cms/app/`.
- There is a `(dashboard)` route group that contains the authenticated/admin UI.
- A shared client-side context (`DuaManagementProvider`) stores state for listing/filtering/editing duas and also contains a few shared UI helpers.

### Dashboard layout & provider placement
`cms/app/(dashboard)/layout.tsx`:
- Server component.
- Fetches Supabase user via `createClient()`.
- Renders the sidebar and wraps the dashboard routes with the **client** `DuaManagementProvider` so that all pages under `(dashboard)` can consume the context.

## Data model
Types live in:
- `cms/app/types.ts`
  - `Category`, `Subcategory`

Duas type comes from the root app:
- `config/types` (`DuaType`)

### Data sources
The CMS reads/writes JSON stored in the main repo:
- `assets/data/duas.json`
- `assets/data/categories.json`

(These are accessed from the CMS server using `process.cwd()` from the `cms/` directory and walking up one level.)

## Important UI routes
All are under `cms/app/`.

- `/(dashboard)/page.tsx`
  - Dashboard overview
  - Fetches `/api/stats`
  - Shows counts + file sizes + timestamps
  - Download actions call context download helpers.

- `/(dashboard)/app/page.tsx`
  - Main dua listing + filters + batch edit + add modal.

- `/(dashboard)/app/edit/[id]/page.tsx`
  - Edit a single dua (client page)
  - Fetches duas + categories from API
  - Includes preview support.

- `/(dashboard)/app/categories/page.tsx`
  - CRUD categories and subcategories
  - Uses the shared `downloadCategories(...)` helper from context.

- `/(dashboard)/app/categories/[key]/page.tsx`
  - Reorder categories/subcategories.

Other placeholder/secondary routes:
- `/(dashboard)/router/page.tsx`
- `/(dashboard)/passport/page.tsx`
- `/(dashboard)/umrah-builder/page.tsx`

## Context: DuaManagement
Files:
- `cms/app/context/DuaManagementContext.tsx`
- `cms/app/context/DuaManagementProvider.tsx`

What it provides (high level):
- Data: `duas`, `categories`, `filteredDuas`
- Filters: `searchQuery`, `selectedCategories`, `filterNoAudio`, `language`
- UI state: `expandedCategories`, `isFilterExpanded`, etc.
- Bulk edit helpers: selection state, batch modal state, apply patch.
- Preview sync helpers.

### Filter persistence
`DuaManagementProvider` persists filter state to `localStorage` so filters survive navigation (and reloads), including when moving between `/app` and `/app/edit/[id]`.

Storage key:
- `manasik-cms:dua-filters:v1`

## Download helpers & tracking
### Client-side download helpers
The context provider exposes:
- `downloadDuas()` – downloads `duas.json`
- `downloadCategories(override?: Category[])` – downloads `categories.json` with shape `{ categories: Category[] }`

Internally both use a Blob + `URL.createObjectURL` + anchor click.

### Tracking “last downloaded”
To track downloads, the provider calls:
- `POST /api/downloads/track` with `{ file: "duas" | "categories" }`

This writes to a local file:
- `cms/_static/download-tracking.json`

This file is **gitignored** (the repo ignores `/cms/_static/`).

### Tracking “last updated”
The dashboard uses file `mtime` (filesystem modified time) of:
- `assets/data/duas.json`
- `assets/data/categories.json`

## API routes
Located in `cms/app/api/*`.

- `GET /api/duas`
- `POST /api/duas`
- `PUT /api/duas`
- `PATCH /api/duas` (batch updates)
- `DELETE /api/duas`

- `POST /api/duas/split` (split a dua into a new one)

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories`
- `DELETE /api/categories`

- `POST /api/categories/[key]/order` (reordering)

- `GET /api/stats`
  - Returns totals, JSON file sizes, audio library size, and timestamps.

- `POST /api/downloads/track`
  - Updates last-downloaded timestamps persisted to `cms/_static/download-tracking.json`.

## Stats
`GET /api/stats` currently reports:
- Dua counts and audio coverage
- Category + subcategory totals
- File sizes for `duas.json` and `categories.json`
- Total size of all `.mp3` in `assets/audio` (flat folder)
- Timestamps:
  - `duasLastUpdatedAt`, `categoriesLastUpdatedAt` (from mtime)
  - `duasLastDownloadedAt`, `categoriesLastDownloadedAt` (from tracking file)

## Dev notes / gotchas
- Because this is a nested Next.js project, prefer **relative imports** when ESLint complains about `@/` alias resolution.
- The dashboard build/layout mixes server + client components:
  - `(dashboard)/layout.tsx` is server, but it can render a client provider as a child.
- File system access is only in server routes (`app/api/*`).
- Download is client-only (uses `document`, `Blob`, `URL`).

