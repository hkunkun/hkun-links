'use client'

import { Share2 } from 'lucide-react'

export function ShareButton({ title }: { title: string }) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${title} - HKun Links`,
                    url: window.location.href,
                })
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Share failed:', err)
                }
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href)
                alert('Link copied to clipboard!')
            } catch (err) {
                console.error('Copy failed:', err)
            }
        }
    }

    return (
        <button
            onClick={handleShare}
            className="icon-button"
            aria-label="Share category"
        >
            <Share2 className="h-5 w-5" />
        </button>
    )
}
