import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/public/Header'
import { SearchBar } from '@/components/public/SearchBar'
import { LinkCard } from '@/components/public/LinkCard'
import { CategorySectionHeader } from '@/components/public/CategorySectionHeader'
import { FloatingActionButton } from '@/components/public/FloatingActionButton'
import { Footer } from '@/components/public/Footer'
import type { Category, Link as LinkType } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  const { data: allLinks } = await supabase
    .from('links')
    .select('*')
    .order('sort_order', { ascending: true })

  const linksByCategory = new Map<string, LinkType[]>()
  allLinks?.forEach((link) => {
    if (!linksByCategory.has(link.category_id)) {
      linksByCategory.set(link.category_id, [])
    }
    linksByCategory.get(link.category_id)?.push(link)
  })

  const hasCategories = categories && categories.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header isLoggedIn={isLoggedIn} />

      <main className="main-content">
        <div className="content-container">
          {/* Hero Search Section */}
          <section className="hero-section">
            <div className="hidden md:block">
              <h2 className="hero-title">What are you looking for?</h2>
              <p className="hero-subtitle">Search through your saved links and tools</p>
            </div>
            <SearchBar />
          </section>

          {/* Category Sections */}
          {hasCategories ? (
            <div className="categories-container">
              {categories.map((category) => {
                const categoryLinks = linksByCategory.get(category.id) || []
                if (categoryLinks.length === 0 && allLinks && allLinks.length > 0) {
                  return null
                }

                return (
                  <section key={category.id} className="category-section">
                    <CategorySectionHeader
                      category={category}
                      linkCount={categoryLinks.length}
                    />
                    {categoryLinks.length > 0 ? (
                      <div className="links-grid">
                        {categoryLinks.slice(0, 4).map((link) => (
                          <LinkCard key={link.id} link={link} />
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <span className="material-symbols-outlined empty-state-icon">link_off</span>
                        <p>No links in this category yet</p>
                      </div>
                    )}
                  </section>
                )
              })}
            </div>
          ) : (
            <section className="empty-state">
              <span className="material-symbols-outlined empty-state-icon">bookmark_add</span>
              <h3 className="empty-state-title">No categories yet</h3>
              <p className="empty-state-description">
                Create categories and add links from the admin dashboard
              </p>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Only show FAB for logged-in users */}
      {isLoggedIn && <FloatingActionButton />}
    </div>
  )
}

