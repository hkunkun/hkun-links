import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Category } from '@/types/database'
import Image from 'next/image'
import { GripVertical, Folder, ChevronDown, ChevronRight, Save, X, Plus, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableLinkItem, LinkWithCounts } from './SortableLinkItem'

interface SortableCategoryItemProps {
    category: Category
    links: LinkWithCounts[]
    isOpen: boolean
    onToggle: () => void
    onUpdateCategory: (id: string, updates: Partial<Category>) => Promise<void>
    onDeleteLink: (linkId: string) => void
    onUpdateLink: (link: LinkWithCounts) => void
    onAddLink: () => void
    onEditCategory?: (category: Category) => void
    onDeleteCategory?: (categoryId: string) => void
}

export function SortableCategoryItem({
    category,
    links,
    isOpen,
    onToggle,
    onUpdateCategory,
    onDeleteLink,
    onUpdateLink,
    onAddLink,
    onEditCategory,
    onDeleteCategory
}: SortableCategoryItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: category.id,
        disabled: category.slug === 'uncategorized'
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '1rem',
    }

    return (
        <div ref={setNodeRef} style={style} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden transition-colors">
            {/* Header / Drag Handle */}
            <div style={{ padding: '1rem', gap: '0.75rem' }} className={`flex items-center transition-colors ${isOpen ? 'bg-[var(--color-surface-hover)] border-b border-[var(--color-border)]' : ''}`}>
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-[var(--color-text-muted)] hover:text-[var(--color-text)] touch-none"
                >
                    <GripVertical size={20} />
                </button>

                <button
                    onClick={onToggle}
                    style={{ padding: '0.25rem' }}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded hover:bg-[var(--color-surface-hover)]"
                >
                    {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>

                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xl shrink-0 border border-[var(--color-primary)]/20">
                    {category.icon === 'folder' || !category.icon ? <Folder size={20} /> : <span>{category.icon}</span>}
                </div>

                <div className="flex-1 font-medium text-[var(--color-text)] text-lg min-w-0 truncate">
                    {category.name}
                </div>

                <div style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingTop: '0.25rem', paddingBottom: '0.25rem' }} className="text-sm bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] font-medium whitespace-nowrap shrink-0">
                    {links.length} links
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEditCategory?.(category)
                        }}
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
                        title="Edit Category"
                    >
                        <Pencil size={16} />
                    </button>
                    {category.slug !== 'uncategorized' && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDeleteCategory?.(category.id)
                            }}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-colors"
                            title="Delete Category"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {isOpen && (
                <div style={{ padding: '1rem' }} className="animate-fadeIn">

                    {/* Links List header */}
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-[var(--color-text)] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontSize: 20 }}>link</span>
                            Links ({links.length})
                        </h4>
                        <div className="flex gap-2">
                            <span className="text-sm text-[var(--color-text-secondary)]">Drag to reorder</span>
                        </div>
                    </div>

                    {/* Draggable Links */}
                    <div className="space-y-2">
                        <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                            {links.map(link => (
                                <SortableLinkItem
                                    key={link.id}
                                    link={link}
                                    onDelete={onDeleteLink}
                                    onEdit={onUpdateLink}
                                />
                            ))}
                        </SortableContext>

                        {links.length === 0 && (
                            <div className="text-center py-8 text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)]/50 rounded-lg border border-dashed border-[var(--color-border)]">
                                No links in this category
                            </div>
                        )}

                        <button
                            style={{
                                width: '100%',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                            className="text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg border border-dashed border-[var(--color-primary)]/30 hover:border-[var(--color-primary)] transition-colors"
                            onClick={onAddLink}
                        >
                            <Plus size={18} />
                            Add Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
