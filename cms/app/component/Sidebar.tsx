'use client'

import { createClient } from '../../lib/supabase/client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  UmrahBuilderIcon,
  RouterIcon,
  PassportIcon,
  DashboardIcon,
  AppIcon
} from "../../../assets/icons";
import { AudioIcon, InfoIcon, ListIcon, TagIcon } from "./icons";

import type { MenuItem } from './sidebar/types'
import { SidebarFooter } from './sidebar/SidebarFooter'
import { SidebarHeader } from './sidebar/SidebarHeader'
import { SidebarNavigation } from './sidebar/SidebarNavigation'

interface SidebarProps {
  userEmail?: string | null
}

export function Sidebar({ userEmail }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
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
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggleCollapsed={() => setIsCollapsed(!isCollapsed)}
      />

      <SidebarNavigation
        isCollapsed={isCollapsed}
        pathname={pathname}
        isInAppSection={isInAppSection}
        showAppSubmenu={showAppSubmenu}
        menuItems={menuItems}
        appSubmenuItems={appSubmenuItems}
        onRequestShowPrimaryMenu={() => setForcePrimaryMenu(true)}
        onRequestShowAppSubmenu={() => setForcePrimaryMenu(false)}
      />

      <SidebarFooter
        isCollapsed={isCollapsed}
        userEmail={userEmail}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />
    </aside>
  )
}