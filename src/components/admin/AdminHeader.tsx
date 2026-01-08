'use client'

import { User } from '@supabase/supabase-js'

interface AdminHeaderProps {
    user: User
    onMenuClick?: () => void
}

export function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
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
                    <button className="admin-icon-btn">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="admin-icon-btn">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
