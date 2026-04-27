// Metro config to support build-time white-labeling.
//
// This maps the import specifier `@/constants/theme` to a company-specific
// theme module at bundle time, so only that company's theme is included.
//
// Usage:
//   COMPANY_ID=halijah npm run ios
//   COMPANY_ID=manasiktech npm run android
//
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('metro-resolver');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Preserve any resolver behavior that Expo injects by default.
const defaultResolveRequest = config.resolver.resolveRequest;

const companyId = process.env.COMPANY_ID || 'manasiktech';
const themeFile = path.resolve(projectRoot, 'constants', `theme.${companyId}.ts`);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@/constants/theme') {
    return { type: 'sourceFile', filePath: themeFile };
  }

  if (typeof defaultResolveRequest === 'function') {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return resolve(context, moduleName, platform);
};

module.exports = config;

