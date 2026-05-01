import type { ComponentType } from 'react'

export interface MenuItem {
  name: string
  href: string
  icon: ComponentType<{ className?: string }>
  exact?: boolean
}

