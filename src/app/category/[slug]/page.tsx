import { createClient } from '@/lib/supabase/server'
import { LinkCard } from '@/components/public/LinkCard'
import { FloatingActionButton } from '@/components/public/FloatingActionButton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import * as LucideIcons from 'lucide-react'
import { ShareButton } from './ShareButton'
import { Footer } from '@/components/public/Footer'
import type { Category } from '@/types/database'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
    params: Promise<{ slug: string }>
}

function getIconComponent(iconName: string): React.ReactNode {
    if (/\p{Emoji}/u.test(iconName)) {
        return <span className="text-xl">{iconName}</span>
    }

    const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName]
    if (IconComponent) {
        return <IconComponent className="h-5 w-5" />
    }

    return <LucideIcons.Folder className="h-5 w-5" />
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    const isLoggedIn = !!user

    // Fetch category
    const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!categoryData) {
        notFound()
    }

    const category = categoryData as Category

    // Fetch links in this category
    const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('category_id', category.id)
        .order('sort_order', { ascending: true })

    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
            <header className="category-page-header">
                <div className="category-header-left">
                    <Link href="/" className="back-btn" aria-label="Back to home">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div className="h-6 w-px bg-[var(--color-border)]"></div>
                    <div className="category-page-title-row">
                        <div className="category-page-icon">
                            {getIconComponent(category.icon)}
                        </div>
                        <h1 className="category-page-title">{category.name}</h1>
                    </div>
                </div>
                <div className="category-header-right">
                    <ShareButton title={category.name} />
                </div>
            </header>

            <main className="category-page-main">
                <div className="mx-auto flex max-w-6xl flex-col gap-6">
                    <div className="category-controls">
                        <p className="category-stats">
                            Showing {links?.length || 0} links in <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{category.name}</span>
                        </p>
                    </div>

                    {links && links.length > 0 ? (
                        <div className="category-grid">
                            {links.map((link) => (
                                <LinkCard key={link.id} link={link} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-[var(--color-text-muted)]">
                            <p>No links in this category yet.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {isLoggedIn && <FloatingActionButton />}
        </div>
    )
}
