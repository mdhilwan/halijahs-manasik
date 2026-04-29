import { createClient } from "../../lib/supabase/server";
import { Sidebar } from '../component/Sidebar'
import { DuaManagementProvider } from "../context/DuaManagementProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <DuaManagementProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar userEmail={user?.email} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </DuaManagementProvider>
  )
}
