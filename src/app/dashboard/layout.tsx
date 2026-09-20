import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'

export const metadata = { title: 'Dashboard | Smart Farm OS' }

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  let userEmail = 'Farmer'
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    userEmail = user.email || 'Farmer'
  } catch {
    // Auth check failed — allow rendering with default
  }
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-body)' }}>
      <div className="bg-mesh" />
      <Sidebar userEmail={userEmail} />
      <main className="flex-1 ml-72 p-10 relative z-10">
        <div className="max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  )
}
