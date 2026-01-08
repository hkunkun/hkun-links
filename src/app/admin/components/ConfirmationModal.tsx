'use client'

interface ConfirmationModalProps {
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmationModal({
    title,
    message,
    onConfirm,
    onCancel,
    isLoading = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}: ConfirmationModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal-backdrop" onClick={onCancel} />
            <div className="modal-content" style={{ maxWidth: '28rem' }}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button onClick={onCancel} className="modal-close">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div style={{ padding: '1.5rem', paddingTop: '0.5rem' }}>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                        {message}
                    </p>
                </div>

                <div className="modal-actions">
                    <button type="button" onClick={onCancel} className="admin-btn admin-btn-secondary">
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`admin-btn ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white border-transparent' : 'admin-btn-primary'}`}
                        disabled={isLoading}
                        style={variant === 'danger' ? { backgroundColor: '#ef4444', color: 'white', borderColor: 'transparent' } : {}}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
