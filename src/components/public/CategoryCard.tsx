'use client'

import { Card } from '@/components/ui'
import type { Category } from '@/types/database'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

interface CategoryCardProps {
    category: Category
    linkCount?: number
}

// Helper to get icon component from string name
function getIconComponent(iconName: string): React.ReactNode {
    // Check if it's an emoji (simple check for non-ASCII or emoji-like strings)
    if (/\p{Emoji}/u.test(iconName)) {
        return <span className="text-2xl">{iconName}</span>
    }

    // Try to get Lucide icon
    const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName]
    if (IconComponent) {
        return <IconComponent className="h-6 w-6" />
    }

    // Fallback to folder icon
    return <LucideIcons.Folder className="h-6 w-6" />
}

export function CategoryCard({ category, linkCount = 0 }: CategoryCardProps) {
    return (
        <Link href={`/category/${category.slug}`} className="block">
            <Card hover className="h-full animate-fadeIn">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--color-primary)/0.2)] to-[hsl(var(--color-secondary)/0.2)] flex items-center justify-center text-[hsl(var(--color-primary))]">
                        {getIconComponent(category.icon)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[hsl(var(--color-text))] truncate">
                            {category.name}
                        </h3>
                        <p className="text-sm text-[hsl(var(--color-text-muted))]">
                            {linkCount} {linkCount === 1 ? 'link' : 'links'}
                        </p>
                    </div>

                    {/* Arrow */}
                    <LucideIcons.ChevronRight className="flex-shrink-0 h-5 w-5 text-[hsl(var(--color-text-muted))]" />
                </div>
            </Card>
        </Link>
    )
}
