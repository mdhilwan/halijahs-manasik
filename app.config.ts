// Dynamic Expo config for white-label builds.
//
// - `COMPANY_ID` controls which asset folders are copied into `assets/images/**/current`
//   (via `scripts/select-brand.mjs`).
// - Other env vars optionally override app identity per company.
//
// Notes:
// - Expo will pass `config` (the base config derived from app.json) into this function.
// - Keep this file small and predictable; avoid runtime filesystem reads here.

type ConfigContext = { config: any };

export default ({ config }: ConfigContext) => {
  const companyId = process.env.COMPANY_ID ?? 'manasiktech';

  return {
    ...config,
    name: process.env.EXPO_NAME ?? config.name,
    slug: process.env.EXPO_SLUG ?? config.slug,
    scheme: process.env.EXPO_SCHEME ?? config.scheme,
    ios: {
      ...config.ios,
      bundleIdentifier: process.env.IOS_BUNDLE_IDENTIFIER ?? config.ios?.bundleIdentifier,
    },
    android: {
      ...config.android,
      package: process.env.ANDROID_PACKAGE ?? config.android?.package,
    },
    extra: {
      ...config.extra,
      companyId,
    },
  };
};

