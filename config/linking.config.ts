// Deep linking configuration
// NOTE: Expo Router handles file-based routing automatically
// This config is for custom URL schemes only

// For now, we'll keep it minimal to avoid route conflicts
export const linking = {
  prefixes: [],  // Empty - we're not using custom schemes yet
  config: {
    screens: {},  // Empty - Expo Router will use file structure
  },
};
