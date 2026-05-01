export type TenantKey = 'halijah' | 'manasiktech'

export function getTenantFromHostname(hostname: string): TenantKey | null {
  const parts = hostname.split('.').filter(Boolean)

  // Examples:
  // - "halijah.manasik.tech" => ["halijah","manasik","tech"]
  // - "localhost" => ["localhost"]
  if (parts.length < 3) return null

  const subdomain = parts[0]?.toLowerCase()

  if (subdomain === 'halijah' || subdomain === 'manasiktech') {
    return subdomain
  }

  return null
}

export type TenantAssets = {
  profileImageSrc: string
}

export function getTenantAssets(tenant: TenantKey | null | undefined): TenantAssets | null {
  if (!tenant) return null

  // This must exist under `cms/public/images/<tenant>/icon.png`,
  // created by your predev/prebuild copy script.
  return {
    profileImageSrc: `/images/${tenant}/icon.png`,
  }
}