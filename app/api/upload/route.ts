import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const year = formData.get('year') as string
    const files = formData.getAll('files') as File[]

    if (!year || files.length === 0) {
      return NextResponse.json({ error: 'Missing year or files' }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', year)
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filePath = path.join(uploadsDir, file.name)
      fs.writeFileSync(filePath, buffer)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
