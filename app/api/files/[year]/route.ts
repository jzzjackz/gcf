import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string } }
) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', params.year)
  
  if (!fs.existsSync(uploadsDir)) {
    return NextResponse.json({ files: [] })
  }

  const files = fs.readdirSync(uploadsDir).map(filename => {
    const ext = path.extname(filename).toLowerCase()
    let type = 'application/octet-stream'
    
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      type = `image/${ext.slice(1)}`
    } else if (ext === '.pdf') {
      type = 'application/pdf'
    }

    return {
      name: filename,
      url: `/uploads/${params.year}/${filename}`,
      type
    }
  })

  return NextResponse.json({ files })
}
