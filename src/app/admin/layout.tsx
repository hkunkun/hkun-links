import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?redirectTo=/admin')
    }

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin-main">
                <AdminHeader user={user} />
                <div className="admin-content">
                    <div className="admin-content-inner">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
