'use client'

import Link from 'next/link'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useState } from 'react'
import { LoginModal } from '@/components/auth/LoginModal'
import { Bookmark, Sun, Moon, LayoutDashboard, LogIn } from 'lucide-react'

interface HeaderProps {
    isLoggedIn?: boolean
    config?: Record<string, string>
}

export function Header({ isLoggedIn, config = {} }: HeaderProps) {
    const { theme, toggleTheme } = useTheme()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const { site_title, logo_url } = config

    return (
        <>
            <header className="site-header">
                <Link href="/" className="site-header-logo">
                    {logo_url ? (
                        <div className="relative h-10 w-auto aspect-square overflow-hidden rounded-lg">
                            <img src={logo_url} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="site-header-logo-icon">
                            <Bookmark size={24} fill="currentColor" />
                        </div>
                    )}
                    <h1 className="site-header-title">{site_title || 'My Bookmarks'}</h1>
                </Link>
                <div className="site-header-actions">
                    <button
                        onClick={toggleTheme}
                        className="icon-button"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    {isLoggedIn ? (
                        <Link href="/admin" className="icon-button" aria-label="Admin Dashboard" title="Admin Dashboard">
                            <LayoutDashboard size={20} />
                        </Link>
                    ) : (
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="login-btn"
                            style={{ width: 'auto', padding: '0 1rem', height: '2.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}
                        >
                            <LogIn size={18} />
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

