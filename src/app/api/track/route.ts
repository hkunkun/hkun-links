// @ts-nocheck
// TypeScript errors will resolve once Supabase is connected with proper database schema

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const { linkId } = await request.json()

        if (!linkId) {
            return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Get request metadata
        const userAgent = request.headers.get('user-agent') || null
        const referer = request.headers.get('referer') || null

        // Hash IP for privacy
        const forwardedFor = request.headers.get('x-forwarded-for')
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
        const ipHash = createHash('sha256').update(ip + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).digest('hex').slice(0, 16)

        // Insert click event
        const { error } = await supabase.from('click_events').insert({
            link_id: linkId as string,
            user_agent: userAgent,
            referrer: referer,
            ip_hash: ipHash,
        } as {
            link_id: string;
            user_agent: string | null;
            referrer: string | null;
            ip_hash: string;
        })

        if (error) {
            console.error('Failed to track click:', error)
            return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Track API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
