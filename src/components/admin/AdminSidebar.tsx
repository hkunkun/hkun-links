'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'pie_chart' },
    { href: '/admin/categories', label: 'Categories', icon: 'folder_open' },
    { href: '/admin/links', label: 'Links', icon: 'link' },
    { href: '/admin/settings', label: 'Settings', icon: 'settings' },
]

interface AdminSidebarProps {
    isOpen?: boolean
    onClose?: () => void
    config?: Record<string, string>
}

export function AdminSidebar({ isOpen, onClose, config = {} }: AdminSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { site_title, logo_url } = config

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const handleLinkClick = () => {
        if (onClose) onClose()
    }

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            {/* Logo */}
            <div className="admin-sidebar-logo">
                {logo_url ? (
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 overflow-hidden shrink-0">
                        <img src={logo_url} alt="Logo" className="h-full w-full object-contain" />
                    </div>
                ) : (
                    <div className="admin-sidebar-logo-icon">
                        <span className="material-symbols-outlined">link</span>
                    </div>
                )}
                <div className="admin-sidebar-logo-text">
                    <h1>{site_title || 'LinkManager'}</h1>
                    <p>Admin Panel</p>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="md:hidden ml-auto p-2 text-gray-500 hover:text-gray-900"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} // Visible only on mobile via CSS if needed, but we rely on overlay usually. 
                // Actually let's just add it and style it.
                >
                    {/* We can rely on overlay to close, or add an X here. Let's add X for clarity */}
                </button>
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
                            onClick={handleLinkClick}
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

                <Link href="/" className="admin-nav-link" onClick={handleLinkClick}>
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
