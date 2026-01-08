'use client'

import { useState } from 'react'
import type { Link, Category, LinkInsert } from '@/types/database'
import Image from 'next/image'

interface LinkWithStats extends Link {
    click_count?: number
}

interface LinkFormModalProps {
    link?: LinkWithStats | null
    categories: Pick<Category, 'id' | 'name' | 'slug'>[]
    onClose: () => void
    onSave: (data: LinkInsert) => void
    isLoading: boolean
    activeCategoryId?: string
}

export function LinkFormModal({ link, categories, onClose, onSave, isLoading, activeCategoryId }: LinkFormModalProps) {
    const [url, setUrl] = useState(link?.url || '')
    const [title, setTitle] = useState(link?.title || '')
    const [description, setDescription] = useState(link?.description || '')
    const [thumbnailUrl, setThumbnailUrl] = useState(link?.thumbnail_url || '')
    const [faviconUrl, setFaviconUrl] = useState(link?.favicon_url || '')
    const [categoryId, setCategoryId] = useState(link?.category_id || activeCategoryId || categories[0]?.id || '')
    const [tags, setTags] = useState(link?.tags?.join(', ') || '')
    const [isFavorite, setIsFavorite] = useState(link?.is_favorite || false)
    const [isFetching, setIsFetching] = useState(false)

    const fetchMetadata = async () => {
        if (!url) return
        setIsFetching(true)
        try {
            const res = await fetch('/api/og-fetch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })
            const data = await res.json()
            if (data.title) setTitle(data.title)
            if (data.description) setDescription(data.description)
            if (data.image) setThumbnailUrl(data.image)
            if (data.favicon) setFaviconUrl(data.favicon)
        } catch (err) {
            console.error('Failed to fetch metadata:', err)
        } finally {
            setIsFetching(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            url,
            title,
            description: description || null,
            thumbnail_url: thumbnailUrl || null,
            favicon_url: faviconUrl || null,
            category_id: categoryId,
            tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : null,
            is_favorite: isFavorite,
        })
    }

    return (
        <div className="modal-overlay">
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-content" style={{ maxWidth: '32rem' }}>
                <div className="modal-header">
                    <h2 className="modal-title">{link ? 'Edit Link' : 'New Link'}</h2>
                    <button onClick={onClose} className="modal-close">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">URL</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" required className="form-input" style={{ flex: 1 }} />
                            <button type="button" onClick={fetchMetadata} disabled={!url || isFetching} className="admin-btn admin-btn-secondary">
                                {isFetching ? 'Fetching...' : 'Fetch'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Link title" required className="form-input" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" rows={2} className="form-input" style={{ resize: 'none' }} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Thumbnail URL</label>
                        <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://example.com/image.png" className="form-input" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="form-input">
                            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tags (comma-separated)</label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="social, news, tools" className="form-input" />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)} className="link-checkbox" />
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: isFavorite ? '#f59e0b' : 'var(--color-text-muted)' }}>star</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Mark as favorite</span>
                    </label>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">Cancel</button>
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (link ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
