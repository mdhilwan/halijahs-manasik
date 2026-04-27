# Publish via EAS (Expo Application Services)

This repo supports **white-label builds**.

- **Brand assets** are selected by `COMPANY_ID` (see `scripts/select-brand.mjs`).
- **Theme tokens** are selected at bundle-time by Metro (see `metro.config.js`).

Because of that, you should build **one binary per company** so customers only download the assets/theme for *their* app.

---

## 0) Prerequisites (one-time)

1) Install / run EAS CLI

```bash
eas --version
```

2) Login

```bash
eas login
```

3) Ensure the project is configured for EAS

```bash
eas whoami
eas project:info
```

> Notes:
> - Build profiles live in `eas.json`.
> - App identity overrides are in `app.config.ts` via env vars (bundle IDs, name, slug, scheme, etc.).

---

## 1) Local build sanity checks (recommended)

Before publishing, run the app locally using the same `COMPANY_ID` you will build with.

```bash
cd /path/to/halijahs-manasik

# Halijah
COMPANY_ID=halijah npm run start

# Manasiktech
COMPANY_ID=manasiktech npm run start
```

If you change `COMPANY_ID`, restart Expo with cache clear:

```bash
COMPANY_ID=halijah npx expo start -c
```

---

## 2) OTA updates (EAS Update)

OTA updates publish JavaScript/asset updates.

You can publish an update to either:

- a **channel** (`--channel`) (recommended when your builds are configured with a channel in `eas.json`), or
- a **branch** (`--branch`) (more direct control; channels typically point at branches).

Use the channel/branch that matches the build you shipped.

### Update development channel

```bash
eas update --channel development --message "Describe the change"
```

### Update production channel

```bash
eas update --channel production --message "Describe the change"
```

### (Alternative) Update a specific branch

```bash
eas update --branch production --message "Describe the change"
```

> Tip: if you plan to have separate production channels per company, add additional channels
> (e.g. `production-halijah`) and corresponding build profiles.

> Note: for Expo SDK 55+, EAS Update may require `--environment` to load server-side env vars during the command.

---

## 3) Build binaries (APK/AAB + iOS archive)

This repo defines company-specific build profiles in `eas.json`:

- `production-halijah` (sets `COMPANY_ID=halijah`)
- `production-manasiktech` (sets `COMPANY_ID=manasiktech`)

### Build for one company (recommended)

```bash
# Halijah
eas build --profile production-halijah --platform all

# Manasiktech
eas build --profile production-manasiktech --platform all
```

### Build non-company-specific profiles (if needed)

```bash
eas build --profile development --platform all
eas build --profile preview --platform all
eas build --profile production --platform all
```

---

## 4) Submit to stores (optional)

After a successful build you can submit:

```bash
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

If you maintain multiple apps (different bundle identifiers/packages), ensure the correct env vars are set
for that build (see `app.config.ts`).

---

## 5) Common release checklist

1) Confirm the correct `COMPANY_ID` for the target customer.
2) Confirm app identity env vars when building a new customer app:
   - `EXPO_NAME`, `EXPO_SLUG`, `EXPO_SCHEME`
   - `IOS_BUNDLE_IDENTIFIER`, `ANDROID_PACKAGE`
3) Update `CHANGELOG.md`.
4) Run lint:

```bash
npm run lint
```

5) Build via the matching EAS profile.
