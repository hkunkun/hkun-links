'use client'

import { LoginForm } from './LoginForm'

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-content" style={{ maxWidth: '30rem', width: '100%', padding: '2rem', borderRadius: '1rem', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
                <LoginForm />
            </div>
        </div>
    )
}
