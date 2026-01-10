'use client'

import type { Link as LinkType } from '@/types/database'
import Image from 'next/image'
import { useState } from 'react'
import { Link2, Star } from 'lucide-react'

interface LinkCardProps {
    link: LinkType
}

export function LinkCard({ link }: LinkCardProps) {
    const [imgError, setImgError] = useState(false)
    const thumbnailUrl = link.favicon_url || link.thumbnail_url

    const handleClick = () => {
        // Track click in background
        fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ linkId: link.id }),
        }).catch(() => { })

        window.open(link.url, '_blank', 'noopener,noreferrer')
    }

    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '')
        } catch {
            return url
        }
    }

    return (
        <button onClick={handleClick} className="link-card">
            <div className="link-card-icon">
                {thumbnailUrl && !imgError ? (
                    <Image
                        src={thumbnailUrl}
                        alt=""
                        width={32}
                        height={32}
                        onError={() => setImgError(true)}
                        unoptimized
                    />
                ) : (
                    <Link2 size={20} style={{ color: 'var(--color-text-muted)' }} />
                )}
            </div>
            <div className="link-card-content">
                <div className="link-card-title">{link.title}</div>
                <div className="link-card-domain hidden md:block">{link.description || getDomain(link.url)}</div>
            </div>
            {link.is_favorite && (
                <Star size={18} fill="#f59e0b" style={{ color: '#f59e0b' }} />
            )}
        </button>
    )
}

