import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link } from '@/types/database'
import Image from 'next/image'
import { GripVertical, Globe, Pencil, Trash2 } from 'lucide-react'

export interface LinkWithCounts extends Link {
    click_count?: number
}

interface SortableLinkItemProps {
    link: LinkWithCounts
    onEdit?: (link: LinkWithCounts) => void
    onDelete?: (linkId: string) => void
}

export function SortableLinkItem({ link, onEdit, onDelete }: SortableLinkItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
        zIndex: isDragging ? 10 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={{ ...style, padding: '0.75rem', gap: '0.75rem', marginBottom: '0.5rem' }}
            className="flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-hover)] transition-colors group"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab text-[var(--color-text-muted)] hover:text-[var(--color-text)] touch-none"
            >
                <GripVertical size={16} />
            </button>

            {/* Icon */}
            <div className="w-8 h-8 rounded bg-[var(--color-surface-elevated)] flex items-center justify-center shrink-0 overflow-hidden border border-[var(--color-border)]">
                {link.favicon_url ? (
                    <Image src={link.favicon_url} alt="" width={20} height={20} className="w-5 h-5 object-contain" unoptimized />
                ) : (
                    <Globe size={16} className="text-[var(--color-text-muted)]" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-[var(--color-text)] truncate">{link.title}</div>
                <div className="text-xs text-[var(--color-text-secondary)] truncate">{link.url}</div>
                {link.description && (
                    <div className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{link.description}</div>
                )}
            </div>

            {/* Metrics */}
            <div className="text-xs text-[var(--color-text-secondary)] text-right px-2 min-w-[3rem]">
                <div className="font-medium text-[var(--color-text)]">{link.click_count || 0}</div>
                <div>clicks</div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    style={{ padding: '0.375rem' }}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded transition-colors"
                    onClick={() => onEdit?.(link)}
                >
                    <Pencil size={14} />
                </button>
                <button
                    style={{ padding: '0.375rem' }}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded transition-colors"
                    onClick={() => onDelete?.(link.id)}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    )
}
