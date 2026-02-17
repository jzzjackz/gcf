import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const year = formData.get('year') as string
    const files = formData.getAll('files') as File[]

    if (!year || files.length === 0) {
      return NextResponse.json({ error: 'Missing year or files' }, { status: 400 })
    }

    const uploadedFiles = []

    for (const file of files) {
      const fileName = `${year}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('archive-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        continue
      }

      uploadedFiles.push(data.path)
    }

    return NextResponse.json({ success: true, files: uploadedFiles })
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
