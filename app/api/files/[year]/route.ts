import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string } }
) {
  try {
    console.log('Fetching files for year:', params.year)
    
    const { data, error } = await supabase.storage
      .from('archive-files')
      .list(params.year, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    console.log('Supabase list response:', { data, error })

    if (error) {
      console.error('List error:', error)
      return NextResponse.json({ files: [], error: error.message })
    }

    if (!data || data.length === 0) {
      console.log('No files found for year:', params.year)
      return NextResponse.json({ files: [] })
    }

    const files = data.map((file) => {
      const { data: urlData } = supabase.storage
        .from('archive-files')
        .getPublicUrl(`${params.year}/${file.name}`)

      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      let type = 'application/octet-stream'
      
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
        type = `image/${ext}`
      } else if (ext === 'pdf') {
        type = 'application/pdf'
      }

      return {
        name: file.name.replace(/^\d+-/, ''), // Remove timestamp prefix
        url: urlData.publicUrl,
        type
      }
    })

    console.log('Returning files:', files)
    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({ files: [], error: String(error) })
  }
}
