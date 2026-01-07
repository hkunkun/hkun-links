import Link from 'next/link'

export function FloatingActionButton() {
    return (
        <Link href="/admin/links?action=new" className="fab" aria-label="Add new link">
            <span className="material-symbols-outlined">add</span>
        </Link>
    )
}
