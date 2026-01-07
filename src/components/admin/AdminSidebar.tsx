'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'pie_chart' },
    { href: '/admin/categories', label: 'Categories', icon: 'folder_open' },
    { href: '/admin/links', label: 'Links', icon: 'link' },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <aside className="admin-sidebar">
            {/* Logo */}
            <div className="admin-sidebar-logo">
                <div className="admin-sidebar-logo-icon">
                    <span className="material-symbols-outlined">link</span>
                </div>
                <div className="admin-sidebar-logo-text">
                    <h1>LinkManager</h1>
                    <p>Admin Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="admin-sidebar-nav">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    )
                })}

                <div className="admin-nav-divider" />

                <Link href="/" className="admin-nav-link">
                    <span className="material-symbols-outlined">home</span>
                    View Site
                </Link>

                <button onClick={handleLogout} className="admin-nav-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                </button>
            </nav>

            {/* User info footer */}
            <div className="admin-sidebar-footer">
                <div className="admin-user-info">
                    <div className="admin-user-avatar">A</div>
                    <div className="admin-user-details">
                        <p>Admin User</p>
                        <span>admin@example.com</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
