'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface SearchBarProps {
    initialValue?: string
    placeholder?: string
}

export function SearchBar({ initialValue = '', placeholder = 'Search links, tags, or folders...' }: SearchBarProps) {
    const [query, setQuery] = useState(initialValue)
    const router = useRouter()

    const handleSearch = useCallback(() => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        }
    }, [query, router])

    useEffect(() => {
        if (!query.trim()) return
        const timer = setTimeout(handleSearch, 500)
        return () => clearTimeout(timer)
    }, [query, handleSearch])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="search-container">
            <label className="search-bar">
                <div className="search-bar-icon">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="search-bar-input"
                    placeholder={placeholder}
                    aria-label="Search queries"
                />

            </label>
        </div>
    )
}

