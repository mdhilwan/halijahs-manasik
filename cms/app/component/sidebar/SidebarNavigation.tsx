'use client'

import Link from 'next/link'
import { ArrowLeftIcon } from '../icons'
import type { MenuItem } from './types'

interface SidebarNavigationProps {
  isCollapsed: boolean
  pathname: string
  isInAppSection: boolean
  showAppSubmenu: boolean
  menuItems: MenuItem[]
  appSubmenuItems: MenuItem[]
  onRequestShowPrimaryMenu: () => void
  onRequestShowAppSubmenu: () => void
}

export function SidebarNavigation({
  isCollapsed,
  pathname,
  isInAppSection,
  showAppSubmenu,
  menuItems,
  appSubmenuItems,
  onRequestShowPrimaryMenu,
  onRequestShowAppSubmenu,
}: SidebarNavigationProps) {
  return (
    <nav className="flex-1 overflow-hidden m-3">
      <div className="relative h-full">
        {/* Primary menu panel (root) */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            showAppSubmenu ? '-translate-x-full' : 'translate-x-0'
          } ${showAppSubmenu ? 'pointer-events-none' : ''}`}
          aria-hidden={showAppSubmenu}
        >
          <ul className="flex flex-col gap-1 overflow-y-auto h-full">
            {menuItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      // If we are already in /app/* and the user explicitly chose to show
                      // the primary menu, clicking “App” should switch to the App submenu
                      // without changing routes.
                      if (item.href === '/app' && isInAppSection) {
                        e.preventDefault()
                        onRequestShowAppSubmenu()
                      }
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* App submenu panel (slides in) */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            showAppSubmenu ? 'translate-x-0' : 'translate-x-full'
          } ${showAppSubmenu ? '' : 'pointer-events-none'}`}
          aria-hidden={!showAppSubmenu}
        >
          <ul className="flex flex-col gap-1 overflow-y-auto h-full">
            <li>
              <button
                type="button"
                onClick={onRequestShowPrimaryMenu}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-secondary hover:text-foreground ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                title={isCollapsed ? 'Back' : undefined}
                aria-label="Back to main menu"
              >
                <ArrowLeftIcon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>Back</span>}
              </button>
            </li>

            <li className="my-2 border-t border-border" />

            {appSubmenuItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}

