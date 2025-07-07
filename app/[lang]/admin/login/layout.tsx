import { AdminAuthProvider } from '@/contexts/admin-auth-context'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Login page needs auth context but no protection
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  )
}
