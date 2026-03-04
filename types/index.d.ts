export interface User {
  id: string
  username: string
  email: string
  avatar_url?: string
  role: 'admin' | 'candidate' | 'voter'
}

export interface Battle {
  id: string
  title: string
  status: 'draft' | 'active' | 'finished'
  prize_pool: number
}

export interface Participant {
  id: string
  battle_id: string
  user_id: string
  total_votes: number
  total_amount: number
  rank: number
  username: string
  avatar_url: string
}
