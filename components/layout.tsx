import React, { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">LLAMABUZZ</h1>
      </header>
      <main className="p-4">{children}</main>
      <footer className="text-center p-4 text-sm text-gray-500">
        &copy; 2026 LLAMABUZZ
      </footer>
    </div>
  )
}
