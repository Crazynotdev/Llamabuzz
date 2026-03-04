"use client"
import Link from "next/link"
import React from "react"

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 h-screen">
      <nav className="flex flex-col gap-2">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/battles">Battles</Link>
        <Link href="/admin/participants">Participants</Link>
        <Link href="/admin/payouts">Payouts</Link>
      </nav>
    </aside>
  )
}
