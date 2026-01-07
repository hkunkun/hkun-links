import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Get counts
    const [
        { count: categoryCount },
        { count: linkCount },
        { count: clickCount },
        { count: todayClickCount },
    ] = await Promise.all([
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('links').select('*', { count: 'exact', head: true }),
        supabase.from('click_events').select('*', { count: 'exact', head: true }),
        supabase
            .from('click_events')
            .select('*', { count: 'exact', head: true })
            .gte('clicked_at', new Date().toISOString().split('T')[0]),
    ])

    // Get recent links
    const { data: recentLinks } = await supabase
        .from('links')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    const stats = [
        { label: 'Total Clicks', value: clickCount || 0, icon: 'ads_click', color: 'blue', trend: '+12%' },
        { label: 'Total Links', value: linkCount || 0, icon: 'link', color: 'purple', trend: '+5%' },
        { label: 'Categories', value: categoryCount || 0, icon: 'folder_open', color: 'orange', trend: '+2%' },
        { label: 'Clicks Today', value: todayClickCount || 0, icon: 'trending_up', color: 'green', trend: '+8%' },
    ]

    return (
        <>
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">System Overview</h1>
                    <p className="admin-page-subtitle">Monitor performance and recent activity on your platform.</p>
                </div>
                <div className="admin-page-actions">
                    <button className="admin-btn admin-btn-secondary">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                        Export Report
                    </button>
                    <Link href="/admin/links?action=new" className="admin-btn admin-btn-primary">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        Create New
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
                {stats.map((stat) => (
                    <div key={stat.label} className="admin-stat-card">
                        <div className="admin-stat-header">
                            <div className={`admin-stat-icon ${stat.color}`}>
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{stat.icon}</span>
                            </div>
                            <span className="admin-stat-trend up">
                                <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '2px' }}>trending_up</span>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="admin-stat-label">{stat.label}</p>
                        <h3 className="admin-stat-value">{stat.value.toLocaleString()}</h3>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">Quick Actions</h3>
                </div>
                <div className="admin-card-body">
                    <div className="admin-quick-actions">
                        <Link href="/admin/categories?action=new" className="admin-btn admin-btn-primary">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                            Add Category
                        </Link>
                        <Link href="/admin/links?action=new" className="admin-btn admin-btn-secondary">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                            Add Link
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Links */}
            {recentLinks && recentLinks.length > 0 && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Recently Added Links</h3>
                        <Link href="/admin/links" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                            View All
                        </Link>
                    </div>
                    <ul className="admin-list">
                        {recentLinks.map((link, index) => (
                            <li key={link.id} className="admin-list-item">
                                <div className="admin-list-item-content">
                                    <div className={`admin-list-item-icon ${['blue', 'purple', 'orange'][index % 3]}`}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>link</span>
                                    </div>
                                    <div>
                                        <p className="admin-list-item-title">{link.title}</p>
                                    </div>
                                </div>
                                <span className="admin-list-item-meta">
                                    {new Date(link.created_at).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}
