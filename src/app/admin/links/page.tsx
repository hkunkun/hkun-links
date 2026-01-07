import { createClient } from '@/lib/supabase/server'
import { LinksManager } from './LinksManager'

export const dynamic = 'force-dynamic'

export default async function LinksPage() {
    const supabase = await createClient()

    const [{ data: links }, { data: categories }] = await Promise.all([
        supabase.from('links').select('*').order('sort_order', { ascending: true }),
        supabase.from('categories').select('id, name, slug').order('sort_order', { ascending: true }),
    ])

    return (
        <div className="pt-4">
            <LinksManager
                initialLinks={links || []}
                categories={categories || []}
            />
        </div>
    )
}
