import { Sidebar } from '@/components/admin/sidebar'
import { SettingsProvider } from '@/contexts/settings-context'
import { AdminAuthProvider } from '@/contexts/admin-auth-context'
import { AuthGuard } from '@/components/admin/auth-guard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <AuthGuard>
        <SettingsProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="flex">
              <Sidebar />
              <main className="flex-1 ml-64">
                <div className="p-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </SettingsProvider>
      </AuthGuard>
    </AdminAuthProvider>
  )
}
