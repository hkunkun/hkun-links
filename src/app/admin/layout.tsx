import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

import { getSiteConfig } from './actions'

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

    const config = await getSiteConfig()

    return (
        <AdminLayoutClient user={user} config={config}>
            {children}
        </AdminLayoutClient>
    )
}
