import { createClient } from '@/lib/supabase/server'
import { CategoriesManager } from './CategoriesManager'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    const supabase = await createClient()

    const { data: categories } = await supabase
        .from('categories')
        .select('*, links(count)')
        .order('sort_order', { ascending: true })

    const categoriesWithCounts = categories?.map((cat) => ({
        ...cat,
        linkCount: Array.isArray(cat.links) ? cat.links.length : (cat.links as { count: number })?.count || 0,
    })) || []

    return (
        <div className="pt-4">
            <CategoriesManager initialCategories={categoriesWithCounts} />
        </div>
    )
}
