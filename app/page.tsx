import Link from 'next/link'

const years = [2022, 2023, 2024, 2025, 2026]

export default function Home() {
  return (
    <div className="container">
      <div className="header">
        <h1>📁 File Archive</h1>
        <p>Browse documents organized by year</p>
      </div>
      
      <div className="folders">
        {years.map(year => (
          <Link href={`/year/${year}`} key={year} className="folder">
            <div className="folder-icon">📂</div>
            <h2>{year}</h2>
          </Link>
        ))}
      </div>

      <div className="admin-link">
        <Link href="/admin">Admin Panel</Link>
      </div>
    </div>
  )
}
