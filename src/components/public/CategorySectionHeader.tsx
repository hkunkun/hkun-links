'use client'

import type { Category } from '@/types/database'
import Link from 'next/link'

interface CategorySectionHeaderProps {
    category: Category
    linkCount: number
    hideViewAll?: boolean
}

export function CategorySectionHeader({ category, linkCount, hideViewAll }: CategorySectionHeaderProps) {
    const isEmoji = category.icon.length <= 2 || /^\p{Emoji}/u.test(category.icon)

    return (
        <div className="category-header">
            <h3 className="category-title">
                {isEmoji ? (
                    <span className="category-icon">{category.icon}</span>
                ) : (
                    <span className="material-symbols-outlined category-icon" style={{ color: 'var(--color-primary)' }}>
                        {category.icon}
                    </span>
                )}
                {category.name}
            </h3>
            {!hideViewAll && (
                <Link href={`/category/${category.slug}`} className="category-view-all">
                    View All
                </Link>
            )}
        </div>
    )
}
