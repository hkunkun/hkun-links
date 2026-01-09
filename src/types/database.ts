export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    icon: string
                    sort_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    icon: string
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    icon?: string
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            links: {
                Row: {
                    id: string
                    category_id: string
                    title: string
                    description: string | null
                    url: string
                    thumbnail_url: string | null
                    favicon_url: string | null
                    tags: string[] | null
                    sort_order: number
                    is_favorite: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    category_id: string
                    title: string
                    description?: string | null
                    url: string
                    thumbnail_url?: string | null
                    favicon_url?: string | null
                    tags?: string[] | null
                    sort_order?: number
                    is_favorite?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    category_id?: string
                    title?: string
                    description?: string | null
                    url?: string
                    thumbnail_url?: string | null
                    favicon_url?: string | null
                    tags?: string[] | null
                    sort_order?: number
                    is_favorite?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            click_events: {
                Row: {
                    id: string
                    link_id: string
                    clicked_at: string
                    referrer: string | null
                    user_agent: string | null
                    country: string | null
                    ip_hash: string | null
                }
                Insert: {
                    id?: string
                    link_id: string
                    clicked_at?: string
                    referrer?: string | null
                    user_agent?: string | null
                    country?: string | null
                    ip_hash?: string | null
                }
                Update: {
                    id?: string
                    link_id?: string
                    clicked_at?: string
                    referrer?: string | null
                    user_agent?: string | null
                    country?: string | null
                    ip_hash?: string | null
                }
            }
            site_config: {
                Row: {
                    key: string
                    value: string
                }
                Insert: {
                    key: string
                    value: string
                }
                Update: {
                    key?: string
                    value?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Link = Database['public']['Tables']['links']['Row']
export type LinkInsert = Database['public']['Tables']['links']['Insert']
export type LinkUpdate = Database['public']['Tables']['links']['Update']

export type ClickEvent = Database['public']['Tables']['click_events']['Row']
export type ClickEventInsert = Database['public']['Tables']['click_events']['Insert']
