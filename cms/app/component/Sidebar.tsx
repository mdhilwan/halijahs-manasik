'use client'

import { createClient } from '../../lib/supabase/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  UmrahBuilderIcon,
  RouterIcon,
  LogoutIcon,
  PassportIcon,
  DashboardIcon,
  AppIcon,
  CollapseIcon
} from "../../../assets/icons";
import { ArrowLeftIcon, AudioIcon, InfoIcon, ListIcon, TagIcon } from "./icons";

interface SidebarProps {
  userEmail?: string | null
}

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}

export function Sidebar({ userEmail }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  // When true, forces showing the primary menu even if we are currently within /app/*.
  const [forcePrimaryMenu, setForcePrimaryMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isInAppSection = useMemo(
    () => pathname === '/app' || pathname.startsWith('/app/'),
    [pathname]
  )

  useEffect(() => {
    // If we navigate away from /app/*, reset to the normal behavior.
    if (!isInAppSection) {
      setForcePrimaryMenu(false)
    }
  }, [isInAppSection])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: DashboardIcon,
      exact: true,
    },
    {
      name: 'App',
      href: '/app',
      icon: AppIcon,
    },
    {
      name: 'Passport',
      href: '/passport',
      icon: PassportIcon,
    },
    {
      name: 'Router',
      href: '/router',
      icon: RouterIcon,
    },
    {
      name: 'Umrah Builder',
      href: '/umrah-builder',
      icon: UmrahBuilderIcon,
    },
  ]

  const appSubmenuItems: MenuItem[] = [
    {
      name: 'Duas',
      href: '/app',
      icon: ListIcon,
      exact: true,
    },
    {
      name: 'Categories',
      href: '/app/categories',
      icon: TagIcon,
    },
    {
      name: 'About',
      href: '/app/about',
      icon: InfoIcon,
    },
    {
      name: 'Audio Library',
      href: '/app/audio-library',
      icon: AudioIcon,
    },
  ]

  const showAppSubmenu = isInAppSection && !forcePrimaryMenu

  return (
    <aside
      className={`flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed && (
          <span className="text-lg font-semibold text-foreground">
            halijah<code>.manasik.tech</code>
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <CollapseIcon isCollapsed={isCollapsed} />
        </button>
      </div>

      {/* Navigation */}
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
                          setForcePrimaryMenu(false)
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
                  onClick={() => setForcePrimaryMenu(true)}
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

      <div className="border-t border-border p-3">
        {!isCollapsed && userEmail && (
          <p className="mb-2 truncate px-3 text-xs text-muted-foreground">
            {userEmail}
          </p>
        )}
        <button
          onClick={handleLogout}
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
    </aside>
  )
}