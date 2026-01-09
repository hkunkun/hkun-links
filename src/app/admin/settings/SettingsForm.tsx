'use client'

import { useState } from 'react'
import { updateSiteConfig } from '../actions'

interface SettingsFormProps {
    initialConfig: Record<string, string>
}

export function SettingsForm({ initialConfig }: SettingsFormProps) {
    const [config, setConfig] = useState(initialConfig)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setConfig(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')

        try {
            const result = await updateSiteConfig(config)

            if (result.success) {
                setMessage('Settings updated successfully!')
            } else {
                setMessage('Failed to update settings.')
            }
        } catch (error) {
            setMessage('An error occurred.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                <input
                    type="text"
                    name="site_title"
                    value={config.site_title || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="My Custom Links"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        name="logo_url"
                        value={config.logo_url || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="/logo.png or https://..."
                    />
                    {config.logo_url && (
                        <div className="w-10 h-10 relative bg-gray-50 rounded border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={config.logo_url} alt="Logo" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">URL to your logo image. Leave empty to use text.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        name="favicon_url"
                        value={config.favicon_url || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="/favicon.ico"
                    />
                    {config.favicon_url && (
                        <div className="w-10 h-10 relative bg-gray-50 rounded border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={config.favicon_url} alt="Favicon" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        </div>
                    )}
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
                {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
        </form>
    )
}
