'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Link as LinkType, Category, LinkInsert } from '@/types/database'
import { createLink, updateLink, deleteLink, deleteLinks, reorderLinks } from '../actions'
import Image from 'next/image'

interface LinksManagerProps {
    initialLinks: LinkType[]
    categories: Pick<Category, 'id' | 'name' | 'slug'>[]
}

const iconColors = ['blue', 'purple', 'pink', 'green', 'orange', 'gray']
const badgeColors = ['purple', 'blue', 'orange', 'teal', 'yellow', 'green', 'pink']

function LinkFormModal({ link, categories, onClose, onSave, isLoading }: {
    link?: LinkType | null
    categories: Pick<Category, 'id' | 'name' | 'slug'>[]
    onClose: () => void
    onSave: (data: LinkInsert) => void
    isLoading: boolean
}) {
    const [url, setUrl] = useState(link?.url || '')
    const [title, setTitle] = useState(link?.title || '')
    const [description, setDescription] = useState(link?.description || '')
    const [thumbnailUrl, setThumbnailUrl] = useState(link?.thumbnail_url || '')
    const [faviconUrl, setFaviconUrl] = useState(link?.favicon_url || '')
    const [categoryId, setCategoryId] = useState(link?.category_id || categories[0]?.id || '')
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

export function LinksManager({ initialLinks, categories }: LinksManagerProps) {
    const [links, setLinks] = useState(initialLinks)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [sortBy, setSortBy] = useState<string>('newest')
    const [editingLink, setEditingLink] = useState<LinkType | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setIsModalOpen(true)
        }
    }, [searchParams])

    // Filter and sort links
    let filteredLinks = links.filter(link => {
        const matchesSearch = !searchQuery ||
            link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            link.url.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = !selectedCategory || link.category_id === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Sort
    if (sortBy === 'newest') {
        filteredLinks = [...filteredLinks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === 'oldest') {
        filteredLinks = [...filteredLinks].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    const handleSave = async (data: LinkInsert) => {
        setIsLoading(true)
        try {
            if (editingLink) {
                const result = await updateLink(editingLink.id, data)
                if (result.error) { alert(result.error); return }
            } else {
                const result = await createLink(data)
                if (result.error) { alert(result.error); return }
            }
            setIsModalOpen(false)
            setEditingLink(null)
            router.refresh()
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (deleteConfirm !== id) { setDeleteConfirm(id); return }
        await deleteLink(id)
        setLinks((prev) => prev.filter((l) => l.id !== id))
        setDeleteConfirm(null)
    }

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return
        await deleteLinks(Array.from(selectedIds))
        setLinks((prev) => prev.filter((l) => !selectedIds.has(l.id)))
        setSelectedIds(new Set())
    }

    const toggleSelect = (id: string, selected: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (selected) next.add(id)
            else next.delete(id)
            return next
        })
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredLinks.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredLinks.map(l => l.id)))
        }
    }

    const getCategoryName = (categoryId: string) => {
        return categories.find(c => c.id === categoryId)?.name || 'Unknown'
    }

    const getCategoryColor = (categoryId: string) => {
        const index = categories.findIndex(c => c.id === categoryId)
        return badgeColors[index % badgeColors.length]
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    if (categories.length === 0) {
        return (
            <>
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Link Management</h1>
                        <p className="admin-page-subtitle">Manage and organize your links</p>
                    </div>
                </div>
                <div className="empty-state">
                    <span className="material-symbols-outlined empty-state-icon">link_off</span>
                    <h3 className="empty-state-title">Create a category first</h3>
                    <p className="empty-state-description">You need at least one category before adding links</p>
                    <button onClick={() => router.push('/admin/categories?action=new')} className="admin-btn admin-btn-primary" style={{ marginTop: '1.5rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        Create Category
                    </button>
                </div>
            </>
        )
    }

    return (
        <>
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Link Management</h1>
                    <p className="admin-page-subtitle">Track performance and organize your shortened links.</p>
                </div>
                <div className="admin-page-actions">
                    {selectedIds.size > 0 && (
                        <button onClick={handleBulkDelete} className="admin-btn admin-btn-secondary">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete_sweep</span>
                            Delete Selected ({selectedIds.size})
                        </button>
                    )}
                    <button onClick={() => { setEditingLink(null); setIsModalOpen(true) }} className="admin-btn admin-btn-primary">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_link</span>
                        Add New
                    </button>
                </div>
            </div>

            {/* Filter Card */}
            <div className="filter-card">
                <div className="filter-search">
                    <span className="filter-search-icon">
                        <span className="material-symbols-outlined">search</span>
                    </span>
                    <input
                        type="text"
                        placeholder="Search by title or URL..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="filter-search-input"
                    />
                </div>
                <div className="filter-dropdowns">
                    <div className="filter-select-wrapper">
                        <span className="filter-select-icon">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>filter_list</span>
                        </span>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="filter-select">
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <span className="filter-select-arrow">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_drop_down</span>
                        </span>
                    </div>
                    <div className="filter-select-wrapper">
                        <span className="filter-select-icon">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>sort</span>
                        </span>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                        <span className="filter-select-arrow">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_drop_down</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            {filteredLinks.length > 0 ? (
                <div className="data-table-wrapper">
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th className="center" style={{ width: '3rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.size === filteredLinks.length && filteredLinks.length > 0}
                                            onChange={toggleSelectAll}
                                            className="link-checkbox"
                                        />
                                    </th>
                                    <th>Title & URL</th>
                                    <th>Category</th>
                                    <th>Clicks</th>
                                    <th>Created</th>
                                    <th className="right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLinks.map((link, index) => (
                                    <tr key={link.id}>
                                        <td className="center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(link.id)}
                                                onChange={(e) => toggleSelect(link.id, e.target.checked)}
                                                className="link-checkbox"
                                            />
                                        </td>
                                        <td>
                                            <div className="table-link-cell">
                                                <div className={`table-link-icon ${iconColors[index % iconColors.length]}`}>
                                                    {link.favicon_url ? (
                                                        <Image src={link.favicon_url} alt="" width={20} height={20} unoptimized />
                                                    ) : (
                                                        <span className="material-symbols-outlined">language</span>
                                                    )}
                                                </div>
                                                <div className="table-link-info">
                                                    <p className="table-link-title">{link.title}</p>
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="table-link-url">
                                                        {link.url}
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`category-badge ${getCategoryColor(link.category_id)}`}>
                                                {getCategoryName(link.category_id)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="click-count">
                                                <span>{link.click_count?.toLocaleString() || 0}</span>
                                                <span className={`material-symbols-outlined click-trend ${(link.click_count || 0) > 100 ? 'up' : 'flat'}`}>
                                                    {(link.click_count || 0) > 100 ? 'trending_up' : 'trending_flat'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            {formatDate(link.created_at)}
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button onClick={() => { setEditingLink(link); setIsModalOpen(true) }} className="table-action-btn" title="Edit">
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(link.id)} className="table-action-btn delete" title="Delete">
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <p className="pagination-info">
                            Showing <strong>1-{filteredLinks.length}</strong> of <strong>{links.length}</strong> links
                        </p>
                        <div className="pagination-buttons">
                            <button className="pagination-btn" disabled>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
                            </button>
                            <button className="pagination-btn active">1</button>
                            <button className="pagination-btn">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    <span className="material-symbols-outlined empty-state-icon">link</span>
                    <h3 className="empty-state-title">No links found</h3>
                    <p className="empty-state-description">
                        {searchQuery || selectedCategory ? 'Try adjusting your filters' : 'Add your first link to get started'}
                    </p>
                    {!searchQuery && !selectedCategory && (
                        <button onClick={() => { setEditingLink(null); setIsModalOpen(true) }} className="admin-btn admin-btn-primary" style={{ marginTop: '1.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                            Add Link
                        </button>
                    )}
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="delete-confirm-toast">
                    <p>Delete this link?</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setDeleteConfirm(null)} className="admin-btn admin-btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                        <button onClick={() => handleDelete(deleteConfirm)} className="admin-btn" style={{ background: '#ef4444', color: 'white', padding: '0.5rem 1rem' }}>Delete</button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <LinkFormModal
                    link={editingLink}
                    categories={categories}
                    onClose={() => { setIsModalOpen(false); setEditingLink(null) }}
                    onSave={handleSave}
                    isLoading={isLoading}
                />
            )}
        </>
    )
}
