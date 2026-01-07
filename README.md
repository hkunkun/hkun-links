# HKun Links

A beautiful, mobile-first bookmark management website built with Next.js 14 and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## Features

### Public View
- 🌓 **Dark/Light Mode** - System preference detection with manual toggle
- 📱 **Mobile-First Design** - Optimized for touch, with long-press context menus
- 🔍 **Real-time Search** - Debounced search across titles, descriptions, and tags
- ⭐ **Favorites Section** - Quick access to favorite links
- 🔗 **Share Categories** - Shareable URLs for specific categories
- 📊 **Click Tracking** - Track link clicks with privacy-preserving analytics

### Admin Dashboard
- 🔐 **Secure Authentication** - Email/password login via Supabase Auth
- 📁 **Category Management** - Create, edit, delete with emoji/icon support
- 🔗 **Link Management** - Full CRUD with automatic metadata fetching
- 🎯 **Manual Sorting** - Drag-and-drop reordering for categories and links
- ✨ **URL Metadata Fetcher** - Auto-fetch title, description, and thumbnails
- 🗑️ **Bulk Operations** - Select and delete multiple links

### PWA Ready
- 📲 Installable on mobile devices
- 🎨 Custom app icons and splash screens

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account

### 1. Clone and Install

```bash
cd hkun-links
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication > Users** and create your admin user
4. Get your project URL and anon key from **Settings > API**

### 3. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public routes (homepage, category, search)
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes (og-fetch, track)
│   └── login/              # Admin login
├── components/
│   ├── admin/              # Admin components (sidebar, header)
│   ├── public/             # Public components (header, cards)
│   ├── providers/          # Context providers (theme)
│   └── ui/                 # Reusable UI components
├── lib/
│   └── supabase/           # Supabase client configuration
└── types/                  # TypeScript types
```

## Self-Hosting

For self-hosting on your own server:

```bash
# Build the production bundle
npm run build

# Start the production server
npm run start
```

Or use Docker:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

## License

MIT
