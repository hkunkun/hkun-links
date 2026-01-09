import type { Metadata, Viewport } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import "./globals-utilities.css"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

const manrope = Manrope({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-manrope',
})

import { getSiteConfig } from '@/app/admin/actions'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig()
  const title = config.site_title || "My Bookmarks"

  return {
    title,
    description: "Curated collection of useful links and resources",
    manifest: "/manifest.json",
    icons: config.favicon_url ? { icon: config.favicon_url } : undefined,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title,
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#101c22" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f8" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* Material Symbols */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
