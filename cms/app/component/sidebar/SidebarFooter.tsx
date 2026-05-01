'use client'

import { LogoutIcon } from '../../../../assets/icons'

interface SidebarFooterProps {
  isCollapsed: boolean
  userEmail?: string | null
  isLoggingOut: boolean
  onLogout: () => void
}

export function SidebarFooter({
  isCollapsed,
  userEmail,
  isLoggingOut,
  onLogout,
}: SidebarFooterProps) {
  return (
    <div className="border-t border-border p-3">
      {!isCollapsed && userEmail && (
        <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{userEmail}</p>
      )}

      <button
        onClick={onLogout}
        disabled={isLoggingOut}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50 ${
          isCollapsed ? 'justify-center' : ''
        }`}
        title={isCollapsed ? 'Logout' : undefined}
      >
        <LogoutIcon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
      </button>
    </div>
  )
}

