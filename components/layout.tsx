'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="p-4 bg-blue-600 text-white flex gap-4">
        <Link href="/">Accueil</Link>
        <Link href="/battles">Battles</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  )
}
