'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/types/database'

interface CategoryFormModalProps {
    category?: Category | null
    onClose: () => void
    onSave: (data: Partial<Category>) => void
    isLoading: boolean
}

export function CategoryFormModal({ category, onClose, onSave, isLoading }: CategoryFormModalProps) {
    const [name, setName] = useState(category?.name || '')
    const [slug, setSlug] = useState(category?.slug || '')
    const [icon, setIcon] = useState(category?.icon || 'folder')

    // Auto-generate slug from name if creating new category
    useEffect(() => {
        if (!category && name) {
            const generatedSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            setSlug(generatedSlug)
        }
    }, [name, category])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            name,
            slug,
            icon: icon || 'folder'
        })
    }

    return (
        <div className="modal-overlay">
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-content" style={{ maxWidth: '28rem' }}>
                <div className="modal-header">
                    <h2 className="modal-title">{category ? 'Edit Category' : 'New Category'}</h2>
                    <button onClick={onClose} className="modal-close">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Category Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Social Media, Tools"
                            required
                            className="form-input"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Slug</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="e.g. social-media"
                            required
                            className="form-input"
                        />
                        <p className="text-xs text-gray-500 mt-1">URL-friendly identifier for this category.</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Icon (Optional)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                placeholder="e.g. folder, star, globe"
                                className="form-input"
                                style={{ flex: 1 }}
                            />
                            <div style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                background: '#f0f9ff',
                                color: '#3b82f6',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #dbeafe'
                            }}>
                                {/* Simple icon preview if it matches common names, else generic */}
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                    {['folder', 'star', 'home', 'settings', 'link', 'image'].includes(icon) ? icon : 'folder'}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Material Symbol name or emoji.</p>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">Cancel</button>
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (category ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
