# File Archive

A document archive organized by year (2022-2026) with admin panel for file management.

## Features

- Browse files organized by year folders
- Admin panel for uploading files
- Copy image URLs for reference
- Dark theme interface

## Setup

1. Create a Supabase project at https://supabase.com

2. Create a storage bucket:
   - Go to Storage in Supabase dashboard
   - Create a new bucket called `archive-files`
   - Make it public

3. Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Install dependencies:
```bash
npm install
```

5. Run development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- Navigate to `/admin`
- Default password: `admin123`
- Upload files to specific years
- Supports images, PDFs, and documents

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

Note: Change the admin password in `app/admin/page.tsx` before deploying to production.
