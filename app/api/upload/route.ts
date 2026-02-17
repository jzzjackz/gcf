import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const year = formData.get('year') as string
    const files = formData.getAll('files') as File[]

    console.log('Upload request:', { year, fileCount: files.length })

    if (!year || files.length === 0) {
      return NextResponse.json({ error: 'Missing year or files' }, { status: 400 })
    }

    const uploadedFiles = []
    const errors = []

    for (const file of files) {
      try {
        const fileName = `${year}/${Date.now()}-${file.name}`
        const arrayBuffer = await file.arrayBuffer()
        
        console.log('Uploading file:', fileName, 'Size:', arrayBuffer.byteLength)
        
        const { data, error } = await supabase.storage
          .from('archive-files')
          .upload(fileName, arrayBuffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('Upload error for', fileName, ':', error)
          errors.push({ file: file.name, error: error.message })
          continue
        }

        console.log('Upload success:', data)
        uploadedFiles.push(data.path)
      } catch (fileError) {
        console.error('File processing error:', fileError)
        errors.push({ file: file.name, error: String(fileError) })
      }
    }

    return NextResponse.json({ 
      success: uploadedFiles.length > 0, 
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
      message: `${uploadedFiles.length} files uploaded${errors.length > 0 ? `, ${errors.length} failed` : ''}`
    })
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json({ error: 'Upload failed: ' + String(error) }, { status: 500 })
  }
}
