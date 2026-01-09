'use client'

import { User } from '@supabase/supabase-js'

import Link from 'next/link'
import { useTheme } from '@/components/providers/ThemeProvider'

interface AdminHeaderProps {
    user: User
    onMenuClick?: () => void
}

export function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
    const { theme, toggleTheme } = useTheme()
    return (
        <header className="admin-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={onMenuClick}
                    className="admin-mobile-toggle"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className="admin-header-title">Dashboard</h2>
            </div>

            <div className="admin-header-actions">
                {/* Search */}
                <div className="admin-search">
                    <span className="admin-search-icon">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
                    </span>
                    <input type="text" placeholder="Search links..." />
                </div>

                {/* Action buttons */}
                <div className="admin-header-icons">
                    <button
                        onClick={toggleTheme}
                        className="admin-icon-btn"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        <span className="material-symbols-outlined">
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>
                    <Link
                        href="/"
                        className="admin-icon-btn"
                        title="View Public Site"
                    >
                        <span className="material-symbols-outlined">home</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}
