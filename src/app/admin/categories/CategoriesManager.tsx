'use client'

import { useState } from 'react'
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
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Category, Link, LinkInsert } from '@/types/database'
import { LinkWithCounts } from './components/SortableLinkItem'
import { SortableCategoryItem } from './components/SortableCategoryItem'
import { createCategory, updateCategory, deleteCategory, reorderCategories, reorderLinks, createLink, updateLink, deleteLink, deleteCategoryAndMoveLinks } from '../actions'
import { Plus, Search } from 'lucide-react'
import { LinkFormModal } from '../components/LinkFormModal'
import { CategoryFormModal } from '../components/CategoryFormModal'
import { ConfirmationModal } from '../components/ConfirmationModal'

interface CategoriesManagerProps {
    initialCategories: (Category & { links: LinkWithCounts[] })[]
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
    const [categories, setCategories] = useState(initialCategories)
    const [openCategoryIds, setOpenCategoryIds] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
    const [editingLink, setEditingLink] = useState<LinkWithCounts | null>(null)
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
    const [isSavingLink, setIsSavingLink] = useState(false)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isSavingCategory, setIsSavingCategory] = useState(false)
    const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
    const [isDeletingCategory, setIsDeletingCategory] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleToggleCategory = (id: string) => {
        setOpenCategoryIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) return

        if (active.id !== over.id) {
            // Check if we are sorting categories
            const activeCategoryIndex = categories.findIndex(c => c.id === active.id)
            const overCategoryIndex = categories.findIndex(c => c.id === over.id)

            if (activeCategoryIndex !== -1 && overCategoryIndex !== -1) {
                // Sorting Categories
                const newCategories = arrayMove(categories, activeCategoryIndex, overCategoryIndex)
                setCategories(newCategories)
                await reorderCategories(newCategories.map(c => c.id))
                return
            }

            // Check if sorting links within a category (assuming single list sorting for now)
            // This requires finding which category contains the active link
            const categoryWithLink = categories.find(c => c.links.some(l => l.id === active.id))
            if (categoryWithLink) {
                const oldIndex = categoryWithLink.links.findIndex(l => l.id === active.id)
                const newIndex = categoryWithLink.links.findIndex(l => l.id === over.id)

                if (oldIndex !== -1 && newIndex !== -1) {
                    const newLinks = arrayMove(categoryWithLink.links, oldIndex, newIndex)
                    // Update state
                    setCategories(categories.map(c =>
                        c.id === categoryWithLink.id ? { ...c, links: newLinks } : c
                    ))
                    // API call
                    await reorderLinks(categoryWithLink.id, newLinks.map(l => l.id))
                }
            }
        }
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setIsCategoryModalOpen(true)
    }

    const handleCreateCategory = () => {
        setEditingCategory(null) // Only creating for now based on user request "fix Add Category button"
        setIsCategoryModalOpen(true)
    }

    const handleSaveCategory = async (data: Partial<Category>) => {
        setIsSavingCategory(true)
        try {
            if (editingCategory) {
                const result = await updateCategory(editingCategory.id, data)
                if (result.data) {
                    setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...result.data } : c))
                }
            } else {
                const result = await createCategory(data as any)
                if (result.data) {
                    setCategories([...categories, { ...result.data, links: [] as LinkWithCounts[] }])
                }
            }
            setIsCategoryModalOpen(false)
            setEditingCategory(null)
        } finally {
            setIsSavingCategory(false)
        }
    }

    const handleUpdateCategory = async (id: string, updates: Partial<Category>) => {
        const result = await updateCategory(id, updates)
        if (result.data) {
            setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c))
        }
    }

    const handleDeleteCategory = (id: string) => {
        setDeleteCategoryId(id)
    }

    const handleConfirmDeleteCategory = async () => {
        if (!deleteCategoryId) return

        setIsDeletingCategory(true)
        try {
            const linksToMove = categories.find(c => c.id === deleteCategoryId)?.links || []
            const result = await deleteCategoryAndMoveLinks(deleteCategoryId)

            if (result.success) {
                const updatedUncategorized = result.uncategorizedCategory as Category

                setCategories(prev => {
                    const filtered = prev.filter(c => c.id !== deleteCategoryId)

                    // Update links with new category_id
                    const movedLinks = linksToMove.map(l => ({
                        ...l,
                        category_id: updatedUncategorized.id,
                        updated_at: new Date().toISOString()
                    }))

                    const existingUncatIndex = filtered.findIndex(c => c.id === updatedUncategorized.id)

                    if (existingUncatIndex !== -1) {
                        const newCats = [...filtered]
                        newCats[existingUncatIndex] = {
                            ...newCats[existingUncatIndex],
                            links: [...newCats[existingUncatIndex].links, ...movedLinks]
                        }
                        return newCats
                    } else {
                        return [...filtered, { ...updatedUncategorized, links: movedLinks }]
                    }
                })
                setDeleteCategoryId(null)
            } else {
                alert(result.error || 'Failed to delete category')
            }
        } finally {
            setIsDeletingCategory(false)
        }
    }

    const handleUpdateLink = (link: LinkWithCounts) => {
        setEditingLink(link)
        setIsLinkModalOpen(true)
    }

    const handleDeleteLink = async (linkId: string) => {
        if (!confirm("Are you sure you want to delete this link?")) return
        const result = await deleteLink(linkId)
        if (result.success) {
            setCategories(prev => prev.map(c => ({
                ...c,
                links: c.links.filter(l => l.id !== linkId)
            })))
        }
    }

    const handleAddLink = (categoryId: string) => {
        setEditingLink(null)
        setActiveCategoryId(categoryId)
        setIsLinkModalOpen(true)
    }

    const handleSaveLink = async (data: LinkInsert) => {
        setIsSavingLink(true)
        try {
            if (editingLink) {
                const isCategoryChanged = data.category_id !== editingLink.category_id
                const result = await updateLink(editingLink.id, data)

                if (result.error) {
                    alert(result.error)
                    return
                }

                if (result.data) {
                    setCategories(prev => {
                        let newCategories = [...prev]
                        if (isCategoryChanged) {
                            newCategories = newCategories.map(c =>
                                c.id === editingLink.category_id
                                    ? { ...c, links: c.links.filter(l => l.id !== editingLink.id) }
                                    : c
                            )
                            newCategories = newCategories.map(c =>
                                c.id === data.category_id
                                    ? { ...c, links: [...c.links, { ...editingLink, ...result.data }] }
                                    : c
                            )
                        } else {
                            newCategories = newCategories.map(c =>
                                c.id === editingLink.category_id
                                    ? { ...c, links: c.links.map(l => l.id === editingLink.id ? { ...l, ...result.data } : l) }
                                    : c
                            )
                        }
                        return newCategories
                    })
                }
            } else {
                if (!data.category_id && activeCategoryId) data.category_id = activeCategoryId

                const result = await createLink(data)
                if (result.error) {
                    alert(result.error)
                    return
                }

                if (result.data) {
                    setCategories(prev => prev.map(c =>
                        c.id === result.data.category_id
                            ? { ...c, links: [...c.links, { ...result.data, click_count: 0 }] }
                            : c
                    ))
                }
            }
            setIsLinkModalOpen(false)
            setEditingLink(null)
            setActiveCategoryId(null)
        } finally {
            setIsSavingLink(false)
        }
    }

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="admin-content-inner">
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Category Management</h1>
                    <p className="admin-page-subtitle">Organize your links by grouping them into categories. Drag to reorder.</p>
                </div>
                <div className="admin-page-actions">
                    <button
                        onClick={handleCreateCategory}
                        className="admin-btn admin-btn-primary"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="filter-card">
                <div className="filter-search">
                    <span className="filter-search-icon">
                        <Search size={20} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="filter-search-input"
                    />
                </div>
            </div>

            {/* List */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={filteredCategories.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {filteredCategories.map(category => (
                            <SortableCategoryItem
                                key={category.id}
                                category={category}
                                links={category.links}
                                isOpen={openCategoryIds.has(category.id)}
                                onToggle={() => handleToggleCategory(category.id)}
                                onUpdateCategory={handleUpdateCategory}
                                onDeleteLink={handleDeleteLink}
                                onUpdateLink={handleUpdateLink}
                                onAddLink={() => handleAddLink(category.id)}
                                onEditCategory={handleEditCategory}
                                onDeleteCategory={handleDeleteCategory}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {filteredCategories.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                    No categories found
                </div>
            )}

            {isLinkModalOpen && (
                <LinkFormModal
                    link={editingLink}
                    categories={categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))}
                    onClose={() => { setIsLinkModalOpen(false); setEditingLink(null); setActiveCategoryId(null) }}
                    onSave={handleSaveLink}
                    isLoading={isSavingLink}
                    activeCategoryId={activeCategoryId || undefined}
                />
            )}

            {isCategoryModalOpen && (
                <CategoryFormModal
                    category={editingCategory}
                    onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null) }}
                    onSave={handleSaveCategory}
                    isLoading={isSavingCategory}
                />
            )}
            {deleteCategoryId && (
                <ConfirmationModal
                    title="Delete Category"
                    message="Are you sure you want to delete this category? All links within it will also be deleted. This action cannot be undone."
                    onConfirm={handleConfirmDeleteCategory}
                    onCancel={() => setDeleteCategoryId(null)}
                    isLoading={isDeletingCategory}
                    confirmText="Delete"
                    variant="danger"
                />
            )}
        </div>
    )
}
