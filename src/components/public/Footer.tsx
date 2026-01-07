import Link from 'next/link'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="public-footer">
            <div className="public-footer-content">
                <span>&copy; {currentYear} - From</span>
                <Link
                    href="https://www.facebook.com/hkunkun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="public-footer-link"
                >
                    Hoa Kuhn
                </Link>
                <span>with</span>
                <span className="footer-heart">❤️</span>
            </div>
        </footer>
    )
}
