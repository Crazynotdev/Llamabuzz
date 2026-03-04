'use client'

import Layout from '@/components/Layout'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [battles, setBattles] = useState<any[]>([])

  useEffect(() => {
    const fetchBattles = async () => {
      const { data } = await supabase.from('battles').select('*')
      setBattles(data || [])
    }
    fetchBattles()
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">LLAMABUZZ Battles</h1>
      <ul>
        {battles.map((battle) => (
          <li key={battle.id} className="mb-2 p-2 border rounded">
            {battle.title} - Votes: {battle.votes}
          </li>
        ))}
      </ul>
    </Layout>
  )
}
