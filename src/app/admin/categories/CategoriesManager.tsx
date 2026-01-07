'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/types/database'
import { createCategory, updateCategory, deleteCategory, reorderCategories } from '../actions'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface CategoryWithCount extends Category {
    linkCount: number
}

// Background colors for category icons
const iconBgColors = ['#e0f2fe', '#fef3c7', '#f3e8ff', '#dcfce7', '#fce7f3', '#dbeafe']

function SortableCategoryItem({
    category,
    index,
    onEdit,
    onDelete
}: {
    category: CategoryWithCount
    index: number
    onEdit: (category: Category) => void
    onDelete: (id: string) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const bgColor = iconBgColors[index % iconBgColors.length]

    return (
        <div ref={setNodeRef} style={style} className="category-item">
            {/* Drag handle */}
            <button
                {...attributes}
                {...listeners}
                className="category-drag-handle"
            >
                <span className="material-symbols-outlined">drag_indicator</span>
            </button>

            {/* Icon */}
            <div className="category-icon" style={{ backgroundColor: bgColor }}>
                {/\p{Emoji}/u.test(category.icon) ? (
                    <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                ) : (
                    <span className="material-symbols-outlined">{category.icon}</span>
                )}
            </div>

            {/* Name */}
            <div className="category-info">
                <p className="category-name">{category.name}</p>
                <p className="category-count-mobile">{category.linkCount} links</p>
            </div>

            {/* Link count (desktop) */}
            <div className="category-count">
                <span className="category-count-badge">{category.linkCount} links</span>
            </div>

            {/* Actions */}
            <div className="category-actions">
                <button
                    onClick={() => onEdit(category)}
                    className="category-action-btn edit"
                    title="Edit"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                </button>
                <button
                    onClick={() => onDelete(category.id)}
                    className="category-action-btn delete"
                    title="Delete"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                </button>
            </div>
        </div>
    )
}

function CategoryFormModal({
    category,
    onClose,
    onSave,
    isLoading
}: {
    category?: Category | null
    onClose: () => void
    onSave: (data: { name: string; slug: string; icon: string }) => void
    isLoading: boolean
}) {
    const [name, setName] = useState(category?.name || '')
    const [slug, setSlug] = useState(category?.slug || '')
    const [icon, setIcon] = useState(category?.icon || '📁')

    const handleNameChange = (value: string) => {
        setName(value)
        if (!category) {
            setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({ name, slug, icon })
    }

    const commonIcons = ['📁', '🔗', '💼', '🎮', '📱', '💻', '🎨', '📚', '🎵', '🎬', '🛒', '✈️', '🍔', '💰']

    return (
        <div className="modal-overlay">
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {category ? 'Edit Category' : 'New Category'}
                    </h2>
                    <button onClick={onClose} className="modal-close">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Icon</label>
                        <div className="icon-picker">
                            {commonIcons.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setIcon(emoji)}
                                    className={`icon-picker-item ${icon === emoji ? 'selected' : ''}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="Or enter emoji/icon name"
                            className="form-input"
                            style={{ marginTop: '0.5rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Category name"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Slug (URL path)</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="category-slug"
                            required
                            pattern="[a-z0-9-]+"
                            className="form-input"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="admin-btn admin-btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (category ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
    const [categories, setCategories] = useState(initialCategories)
    const [searchQuery, setSearchQuery] = useState('')
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Check for action=new in URL
    useState(() => {
        if (searchParams.get('action') === 'new') {
            setIsModalOpen(true)
        }
    })

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = categories.findIndex((cat) => cat.id === active.id)
            const newIndex = categories.findIndex((cat) => cat.id === over.id)

            const newOrder = arrayMove(categories, oldIndex, newIndex)
            setCategories(newOrder)

            await reorderCategories(newOrder.map((cat) => cat.id))
        }
    }

    const handleSave = async (data: { name: string; slug: string; icon: string }) => {
        setIsLoading(true)

        try {
            if (editingCategory) {
                const result = await updateCategory(editingCategory.id, data)
                if (result.error) {
                    alert(result.error)
                    return
                }
            } else {
                const result = await createCategory(data)
                if (result.error) {
                    alert(result.error)
                    return
                }
            }

            setIsModalOpen(false)
            setEditingCategory(null)
            router.refresh()
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (deleteConfirm !== id) {
            setDeleteConfirm(id)
            return
        }

        const result = await deleteCategory(id)
        if (result.error) {
            alert(result.error)
            return
        }

        setCategories((prev) => prev.filter((cat) => cat.id !== id))
        setDeleteConfirm(null)
    }

    const openEditModal = (category: Category) => {
        setEditingCategory(category)
        setIsModalOpen(true)
    }

    const openNewModal = () => {
        setEditingCategory(null)
        setIsModalOpen(true)
    }

    return (
        <>
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Category Management</h1>
                    <p className="admin-page-subtitle">
                        Organize your links by grouping them into categories. Drag to reorder display order.
                    </p>
                </div>
                <div className="admin-page-actions">
                    <button onClick={openNewModal} className="admin-btn admin-btn-primary">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        Add Category
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="category-search">
                <span className="category-search-icon">
                    <span className="material-symbols-outlined">search</span>
                </span>
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="category-search-input"
                />
            </div>

            {/* Category List */}
            {filteredCategories.length > 0 ? (
                <>
                    {/* Header row */}
                    <div className="category-list-header">
                        <div style={{ width: '2.5rem' }}></div>
                        <div style={{ flex: 1 }}>Category Name</div>
                        <div style={{ width: '8rem', textAlign: 'right' }}>Link Count</div>
                        <div style={{ width: '6rem', textAlign: 'right' }}>Actions</div>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={filteredCategories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                            <div className="category-list">
                                {filteredCategories.map((category, index) => (
                                    <SortableCategoryItem
                                        key={category.id}
                                        category={category}
                                        index={index}
                                        onEdit={openEditModal}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <div className="category-list-footer">
                        <p>Showing {filteredCategories.length} categories</p>
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    <span className="material-symbols-outlined empty-state-icon">folder_open</span>
                    <h3 className="empty-state-title">No categories yet</h3>
                    <p className="empty-state-description">Create your first category to start organizing links</p>
                    <button onClick={openNewModal} className="admin-btn admin-btn-primary" style={{ marginTop: '1.5rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        Create Category
                    </button>
                </div>
            )}

            {/* Delete confirmation */}
            {deleteConfirm && (
                <div className="delete-confirm-toast">
                    <p>Delete this category?</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setDeleteConfirm(null)} className="admin-btn admin-btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                            Cancel
                        </button>
                        <button onClick={() => handleDelete(deleteConfirm)} className="admin-btn" style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white' }}>
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <CategoryFormModal
                    category={editingCategory}
                    onClose={() => {
                        setIsModalOpen(false)
                        setEditingCategory(null)
                    }}
                    onSave={handleSave}
                    isLoading={isLoading}
                />
            )}
        </>
    )
}
