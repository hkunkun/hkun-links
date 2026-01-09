import { getSiteConfig } from '../actions'
import { SettingsForm } from './SettingsForm'

export default async function SettingsPage() {
    const config = await getSiteConfig()

    return (
        <>
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Site Settings</h1>
                    <p className="admin-page-subtitle">Configure your site's appearance and metadata.</p>
                </div>
            </div>

            <SettingsForm initialConfig={config} />
        </>
    )
}
