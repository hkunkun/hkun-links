import { createClient } from '@/lib/supabase/server'
import { Header, LinkCard, SearchBar } from '@/components/public'
import { Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q: query } = await searchParams
    const supabase = await createClient()

    let links: Awaited<ReturnType<typeof supabase.from<'links'>>>['data'] = null

    if (query && query.trim()) {
        // Search in title, description, and tags
        const searchTerm = `%${query.trim()}%`

        const { data } = await supabase
            .from('links')
            .select('*')
            .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
            .order('sort_order', { ascending: true })
            .limit(50)

        links = data
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 pb-safe">
                {/* Back and Search */}
                <div className="flex items-center gap-2 mb-6">
                    <Link
                        href="/"
                        className="p-2 -ml-2 rounded-lg text-[hsl(var(--color-text-secondary))] hover:text-[hsl(var(--color-text))] hover:bg-[hsl(var(--color-surface-hover))] transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <SearchBar defaultValue={query || ''} />
                    </div>
                </div>

                {/* Results */}
                {query ? (
                    <>
                        <p className="text-sm text-[hsl(var(--color-text-muted))] mb-4">
                            {links?.length || 0} result{links?.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                        </p>

                        {links && links.length > 0 ? (
                            <div className="grid gap-3">
                                {links.map((link) => (
                                    <LinkCard key={link.id} link={link} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-[hsl(var(--color-text-muted))]">
                                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No links found for &ldquo;{query}&rdquo;</p>
                                <p className="text-sm mt-1">Try different keywords</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 text-[hsl(var(--color-text-muted))]">
                        <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Start typing to search</p>
                    </div>
                )}
            </main>
        </div>
    )
}
