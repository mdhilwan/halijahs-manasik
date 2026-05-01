'use client'

import { CollapseIcon } from '../../../../assets/icons'

interface SidebarHeaderProps {
  isCollapsed: boolean
  onToggleCollapsed: () => void
}

export function SidebarHeader({
  isCollapsed,
  onToggleCollapsed,
}: SidebarHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-border px-4">
      {!isCollapsed && (
        <span className="text-lg font-semibold text-foreground">
          halijah<code>.manasik.tech</code>
        </span>
      )}

      <button
        onClick={onToggleCollapsed}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <CollapseIcon isCollapsed={isCollapsed} />
      </button>
    </div>
  )
}

