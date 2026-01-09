import { getSiteConfig } from '../actions'
import { SettingsForm } from './SettingsForm'

export default async function SettingsPage() {
    const config = await getSiteConfig()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
                <p className="text-gray-500 mt-1">Configure your site's appearance and metadata.</p>
            </div>

            <SettingsForm initialConfig={config} />
        </div>
    )
}
