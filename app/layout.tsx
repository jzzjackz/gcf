import './globals.css'

export const metadata = {
  title: 'File Archive',
  description: 'Document archive organized by year',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
