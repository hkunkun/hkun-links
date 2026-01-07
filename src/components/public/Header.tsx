'use client'

import Link from 'next/link'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useState } from 'react'
import { LoginModal } from '@/components/auth/LoginModal'

export function Header({ isLoggedIn }: { isLoggedIn?: boolean }) {
    const { theme, toggleTheme } = useTheme()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    return (
        <>
            <header className="site-header">
                <Link href="/" className="site-header-logo">
                    <div className="site-header-logo-icon">
                        <span className="material-symbols-outlined icon-filled">bookmarks</span>
                    </div>
                    <h1 className="site-header-title">My Bookmarks</h1>
                </Link>
                <div className="site-header-actions">
                    <button
                        onClick={toggleTheme}
                        className="icon-button"
                        aria-label="Toggle theme"
                    >
                        <span className="material-symbols-outlined">
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>
                    {isLoggedIn ? (
                        <Link href="/admin" className="icon-button" aria-label="Admin Dashboard" title="Admin Dashboard">
                            <span className="material-symbols-outlined">dashboard</span>
                        </Link>
                    ) : (
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="login-btn"
                            style={{ width: 'auto', padding: '0 1rem', height: '2.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
                            Login
                        </button>
                    )}
                </div>
            </header>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    )
}
