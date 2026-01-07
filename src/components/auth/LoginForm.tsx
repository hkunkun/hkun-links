'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { login } from '@/app/login/actions'
import Link from 'next/link'

const initialState = {
    error: '',
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button type="submit" className="login-btn" disabled={pending}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
            {pending ? 'Signing in...' : 'Sign in'}
        </button>
    )
}

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
    const [state, formAction] = useActionState(login, initialState)
    const [showPassword, setShowPassword] = useState(false)

    // Note: onSuccess isn't easily called with server actions redirecting.
    // However, if we move redirect to client or if we just let the redirect happen, it's fine.
    // The modal will close because the page will navigate away/refresh.

    return (
        <div className="login-card" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
            <div className="login-header-content">
                <div className="login-icon-circle">
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>lock</span>
                </div>
                <h1 className="login-title">Welcome back!</h1>
                <p className="login-subtitle">Please enter your details to continue.</p>
            </div>

            <form action={formAction} className="login-form">
                <div className="form-field">
                    <label className="form-label">Email or Username</label>
                    <div className="form-input-wrapper">
                        <span className="material-symbols-outlined form-input-icon">person</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="user@example.com"
                            required
                            className="form-input form-input-custom"
                        />
                    </div>
                </div>

                <div className="form-field">
                    <label className="form-label">Password</label>
                    <div className="form-input-wrapper">
                        <span className="material-symbols-outlined form-input-icon">key</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="••••••••"
                            required
                            className="form-input form-input-custom"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <span className="material-symbols-outlined">
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                </div>

                {state?.error && (
                    <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.5rem', color: '#ef4444', fontSize: '0.875rem' }}>
                        {state.error}
                    </div>
                )}

                <SubmitButton />
            </form>
        </div>
    )
}
