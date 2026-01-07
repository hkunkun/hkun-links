import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json()

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 })
        }

        // Validate URL
        try {
            new URL(url)
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
        }

        // Fetch the page
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; HKunLinks/1.0; +https://hkun.links)',
            },
            signal: AbortSignal.timeout(10000),
        })

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 })
        }

        const html = await response.text()
        const baseUrl = new URL(url)

        // Extract metadata using regex (simpler than loading a DOM parser)
        const getMetaContent = (name: string): string | null => {
            const patterns = [
                new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i'),
                new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${name}["']`, 'i'),
                new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i'),
                new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, 'i'),
            ]
            for (const pattern of patterns) {
                const match = html.match(pattern)
                if (match) return match[1]
            }
            return null
        }

        // Get title
        let title = getMetaContent('og:title') || getMetaContent('twitter:title')
        if (!title) {
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
            title = titleMatch ? titleMatch[1].trim() : null
        }

        // Get description
        const description = getMetaContent('og:description') || getMetaContent('twitter:description') || getMetaContent('description')

        // Get image
        let image = getMetaContent('og:image') || getMetaContent('twitter:image')
        if (image && !image.startsWith('http')) {
            image = new URL(image, baseUrl.origin).href
        }

        // Get favicon
        let favicon: string | null = null
        const faviconPatterns = [
            /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
            /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
            /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i,
        ]
        for (const pattern of faviconPatterns) {
            const match = html.match(pattern)
            if (match) {
                favicon = match[1]
                break
            }
        }
        if (!favicon) {
            favicon = `${baseUrl.origin}/favicon.ico`
        } else if (!favicon.startsWith('http')) {
            favicon = new URL(favicon, baseUrl.origin).href
        }

        return NextResponse.json({
            title: title ? decodeHtmlEntities(title) : null,
            description: description ? decodeHtmlEntities(description) : null,
            image,
            favicon,
        })
    } catch (error) {
        console.error('OG fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 })
    }
}

function decodeHtmlEntities(text: string): string {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
}
