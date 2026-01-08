'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import type { User } from '@supabase/supabase-js'

interface AdminLayoutClientProps {
    children: React.ReactNode
    user: User
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="admin-container">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="admin-main">
                <AdminHeader
                    user={user}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <div className="admin-content">
                    <div className="admin-content-inner">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
