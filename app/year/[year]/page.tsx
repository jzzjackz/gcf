'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface FileItem {
  name: string
  url: string
  type: string
}

export default function YearPage({ params }: { params: { year: string } }) {
  const [files, setFiles] = useState<FileItem[]>([])

  useEffect(() => {
    fetch(`/api/files/${params.year}`)
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
  }, [params.year])

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Image URL copied to clipboard!')
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">← Back to Archive</Link>
      
      <div className="header">
        <h1>📂 {params.year}</h1>
        <p>{files.length} file(s)</p>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <p>No files uploaded yet for this year</p>
        </div>
      ) : (
        <div className="files-grid">
          {files.map((file, idx) => (
            <div key={idx} className="file-card">
              {file.type.startsWith('image/') ? (
                <img src={file.url} alt={file.name} className="file-preview" />
              ) : (
                <div className="file-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                  📄
                </div>
              )}
              <div className="file-name">{file.name}</div>
              <div className="file-actions">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  View
                </a>
                {file.type.startsWith('image/') && (
                  <button onClick={() => copyImageUrl(file.url)} className="btn btn-secondary">
                    Copy URL
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
