'use client'

import './globals.css'
// ⚠️ obligatoire pour tous les composants client

import Layout from "@/components/Layout"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useEffect, useState, ReactNode } from "react"
//import { ReactNode } from 'react'

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
