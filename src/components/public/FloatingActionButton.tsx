import Link from 'next/link'
import { Plus } from 'lucide-react'

export function FloatingActionButton() {
    return (
        <Link href="/admin/links?action=new" className="fab" aria-label="Add new link">
            <Plus size={24} />
        </Link>
    )
}

