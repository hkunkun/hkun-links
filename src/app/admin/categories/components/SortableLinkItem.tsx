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
            className="flex items-center bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-gray-200 dark:hover:border-gray-600 transition-colors group"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-none"
            >
                <GripVertical size={16} />
            </button>

            {/* Icon */}
            <div className="w-8 h-8 rounded bg-gray-50 dark:bg-slate-900/50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 dark:border-gray-700">
                {link.favicon_url ? (
                    <Image src={link.favicon_url} alt="" width={20} height={20} className="w-5 h-5 object-contain" unoptimized />
                ) : (
                    <Globe size={16} className="text-gray-400 dark:text-gray-500" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{link.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{link.url}</div>
                {link.description && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{link.description}</div>
                )}
            </div>

            {/* Metrics */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right px-2 min-w-[3rem]">
                <div className="font-medium text-gray-900 dark:text-gray-100">{link.click_count || 0}</div>
                <div>clicks</div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    style={{ padding: '0.375rem' }}
                    className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded hover:bg-blue-50 transition-colors"
                    onClick={() => onEdit?.(link)}
                >
                    <Pencil size={14} />
                </button>
                <button
                    style={{ padding: '0.375rem' }}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded hover:bg-red-50 transition-colors"
                    onClick={() => onDelete?.(link.id)}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    )
}
