import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'LLAMABUZZ',
  description: 'Concours des participants LLAMABUZZ',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
