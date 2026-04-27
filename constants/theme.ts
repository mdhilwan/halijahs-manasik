// NOTE:
// - At bundle time, Metro rewrites `@/constants/theme` to `constants/theme.<companyId>.ts`.
// - This file remains as a typecheck/editor fallback and default implementation.
//
// The Metro alias is implemented in `metro.config.js`.

export { Colors } from './theme.manasiktech';
