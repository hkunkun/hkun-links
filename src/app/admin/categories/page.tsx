import { createClient } from '@/lib/supabase/server'
import { CategoriesManager } from './CategoriesManager'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    const supabase = await createClient()

    const { data: categories } = await supabase
        .from('categories')
        .select(`
            *,
            links (
                *,
                click_events (count)
            )
        `)
        .order('sort_order', { ascending: true })

    const categoriesWithData = categories?.map((cat: any) => ({
        ...cat,
        links: Array.isArray(cat.links)
            ? cat.links.map((link: any) => ({
                ...link,
                click_count: link.click_events?.[0]?.count || 0
            })).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
            : []
    })) || []

    return (
        <div className="pt-4">
            <CategoriesManager initialCategories={categoriesWithData} />
        </div>
    )
}
