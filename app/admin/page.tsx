'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const years = [2022, 2023, 2024, 2025, 2026]

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'flamingochill1234') {
      sessionStorage.setItem('admin_auth', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (!selectedYear || files.length === 0) {
      alert('Please select a year and files')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('year', selectedYear.toString())
    files.forEach(file => formData.append('files', file))

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const result = await res.json()
      console.log('Upload result:', result)
      
      if (res.ok) {
        alert(`Files uploaded successfully! ${result.files?.length || 0} files uploaded.`)
        setFiles([])
        setSelectedYear(null)
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        alert(`Upload failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload error: ' + error)
    } finally {
      setUploading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-form">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            Login
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" className="back-link">← Back to Archive</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">← Back to Archive</Link>
      
      <div className="header">
        <h1>🔐 Admin Panel</h1>
        <p>Upload files to the archive</p>
      </div>

      <div className="upload-section">
        <h2>Upload Files</h2>
        
        <div className="form-group" style={{ marginTop: '20px' }}>
          <label>Select Year</label>
          <select 
            value={selectedYear || ''} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#fff', fontSize: '1rem' }}
          >
            <option value="">Choose a year...</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        {files.length > 0 && (
          <p>{files.length} file(s) selected</p>
        )}

        <button 
          onClick={handleUpload} 
          disabled={uploading || !selectedYear || files.length === 0}
          className="btn btn-primary"
          style={{ marginTop: '20px' }}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </div>
  )
}
