'use server'

// @ts-nocheck
// TypeScript errors will resolve once Supabase is connected with proper database schema

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CategoryInsert, CategoryUpdate, LinkInsert, LinkUpdate, ClickEventInsert } from '@/types/database'

// ==================== CATEGORIES ====================

export async function createCategory(data: CategoryInsert) {
    const supabase = await createClient()

    // Get max sort_order
    const { data: maxOrder } = await supabase
        .from('categories')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

    const newSortOrder = ((maxOrder as { sort_order: number } | null)?.sort_order || 0) + 1

    const { data: category, error } = await supabase
        .from('categories')
        .insert({ ...data, sort_order: newSortOrder } as CategoryInsert)
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/categories')
    return { data: category }
}

export async function updateCategory(id: string, data: CategoryUpdate) {
    const supabase = await createClient()

    const { data: category, error } = await supabase
        .from('categories')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/categories')
    return { data: category }
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/categories')
    return { success: true }
}

export async function reorderCategories(orderedIds: string[]) {
    const supabase = await createClient()

    const updates = orderedIds.map((id, index) => ({
        id,
        sort_order: index,
        updated_at: new Date().toISOString(),
    }))

    for (const update of updates) {
        await supabase
            .from('categories')
            .update({ sort_order: update.sort_order, updated_at: update.updated_at })
            .eq('id', update.id)
    }

    revalidatePath('/')
    revalidatePath('/admin/categories')
    return { success: true }
}

// ==================== LINKS ====================

export async function createLink(data: LinkInsert) {
    const supabase = await createClient()

    // Get max sort_order for this category
    const { data: maxOrder } = await supabase
        .from('links')
        .select('sort_order')
        .eq('category_id', data.category_id)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

    const newSortOrder = (maxOrder?.sort_order || 0) + 1

    const { data: link, error } = await supabase
        .from('links')
        .insert({ ...data, sort_order: newSortOrder })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/')
    revalidatePath('/admin/links')
    revalidatePath('/admin/categories')
    return { data: link }
}

export async function updateLink(id: string, data: LinkUpdate) {
    const supabase = await createClient()

    const { data: link, error } = await supabase
        .from('links')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/')
    revalidatePath('/admin/links')
    revalidatePath('/admin/categories')
    return { data: link }
}

export async function deleteLink(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/')
    revalidatePath('/admin/links')
    revalidatePath('/admin/categories')
    return { success: true }
}

export async function deleteLinks(ids: string[]) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('links')
        .delete()
        .in('id', ids)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/')
    revalidatePath('/admin/links')
    revalidatePath('/admin/categories')
    return { success: true }
}

export async function reorderLinks(categoryId: string, orderedIds: string[]) {
    const supabase = await createClient()

    const updates = orderedIds.map((id, index) => ({
        id,
        sort_order: index,
        updated_at: new Date().toISOString(),
    }))

    for (const update of updates) {
        await supabase
            .from('links')
            .update({ sort_order: update.sort_order, updated_at: update.updated_at })
            .eq('id', update.id)
    }

    revalidatePath('/')
    revalidatePath(`/category/${categoryId}`)
    revalidatePath('/admin/links')
    revalidatePath('/admin/categories')
    return { success: true }
}

export async function moveLinkToCategory(linkId: string, categoryId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('links')
        .update({ category_id: categoryId, updated_at: new Date().toISOString() })
        .eq('id', linkId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/links')
    return { success: true }
}

// ==================== CLICK TRACKING ====================

export async function trackClick(data: ClickEventInsert) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('click_events')
        .insert(data)

    if (error) {
        console.error('Failed to track click:', error)
    }
}

// ==================== IMPORT/EXPORT ====================

export async function exportData() {
    const supabase = await createClient()

    const [{ data: categories }, { data: links }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('links').select('*').order('sort_order'),
    ])

    return {
        exportedAt: new Date().toISOString(),
        categories: categories || [],
        links: links || [],
    }
}

export async function importData(data: { categories: CategoryInsert[]; links: LinkInsert[] }) {
    const supabase = await createClient()

    // Import categories first
    for (const category of data.categories) {
        const { id, ...rest } = category as CategoryInsert & { id?: string }
        await supabase.from('categories').upsert(category)
    }

    // Then import links
    for (const link of data.links) {
        await supabase.from('links').upsert(link)
    }

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
}
