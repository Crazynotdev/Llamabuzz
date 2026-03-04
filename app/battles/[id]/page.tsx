"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import VoteButton from "@/components/VoteButton"
import { Menu, X, Trophy, Medal, Star, Users, TrendingUp, Heart, Share2, Crown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Participant {
  id: string
  username: string
  avatar_url: string
  total_votes: number
  total_amount: number
  rank: number
}

export default function BattlePage({ params }: { params: { id: string } }) {
  const battleId = params.id
  const [participants, setParticipants] = useState<Participant[]>([])
  const [battleTitle, setBattleTitle] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBattle = async () => {
      const { data } = await supabase
        .from("battles")
        .select("title, description, cover_image")
        .eq("id", battleId)
        .single()
      setBattleTitle(data?.title || "")
    }

    const fetchParticipants = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from("top_participants")
        .select("*")
        .eq("battle_id", battleId)
        .order("rank", { ascending: true })

      setParticipants(data || [])
      setIsLoading(false)
    }

    fetchBattle()
    fetchParticipants()

    // Realtime updates avec animation
    const sub = supabase
      .channel(`participants:${battleId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "participants" },
        () => fetchParticipants()
      )
      .subscribe()

    return () => supabase.removeChannel(sub)
  }, [battleId])

  // Filtrer les participants par catégorie
  const filteredParticipants = selectedCategory === "all" 
    ? participants 
    : selectedCategory === "top3" 
      ? participants.filter(p => p.rank <= 3)
      : participants

  // Obtenir la médaille selon le rang
  const getRankMedal = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />
      case 2: return <Medal className="w-6 h-6 text-gray-400" />
      case 3: return <Medal className="w-6 h-6 text-amber-600" />
      default: return <span className="text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  // Formater le montant
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Menu Burger Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Menu Burger Panel */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white/10 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Menu</h2>
            <button onClick={() => setMenuOpen(false)} className="text-white hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-4">
            <Link href="/dashboard" className="flex items-center space-x-3 text-white hover:bg-white/10 p-3 rounded-lg transition">
              <Users className="w-5 h-5" />
              <span>Tableau de bord</span>
            </Link>
            <Link href="/battles" className="flex items-center space-x-3 text-white hover:bg-white/10 p-3 rounded-lg transition">
              <Trophy className="w-5 h-5" />
              <span>Mes battles</span>
            </Link>
            <Link href="/profile" className="flex items-center space-x-3 text-white hover:bg-white/10 p-3 rounded-lg transition">
              <Star className="w-5 h-5" />
              <span>Profil</span>
            </Link>
            <Link href="/ranking" className="flex items-center space-x-3 text-white hover:bg-white/10 p-3 rounded-lg transition">
              <TrendingUp className="w-5 h-5" />
              <span>Classement</span>
            </Link>
          </nav>

          <div className="absolute bottom-8 left-6 right-6">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white text-sm opacity-80">Battle en cours</p>
              <p className="text-white font-bold">{participants.length} participants</p>
              <div className="w-full bg-white/10 h-2 rounded-full mt-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                  style={{ width: `${(participants.filter(p => p.total_votes > 0).length / participants.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header avec Logo */}
      <header className="bg-black/20 backdrop-blur-md sticky top-0 z-30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo à gauche */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMenuOpen(true)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-10 h-10">
                  <Image
                    src="/media/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-white font-bold text-xl hidden sm:block">Battle Arena</span>
              </Link>
            </div>

            {/* Stats rapides */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-2 text-white">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="font-semibold">{participants.reduce((acc, p) => acc + p.total_votes, 0)}</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">{participants.length}</span>
              </div>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filtres rapides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-2 rounded-full font-semibold transition transform hover:scale-105 ${
              selectedCategory === "all"
                ? "bg-white text-purple-900 shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setSelectedCategory("top3")}
            className={`px-6 py-2 rounded-full font-semibold transition transform hover:scale-105 flex items-center space-x-2 ${
              selectedCategory === "top3"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Top 3</span>
          </button>
          <button
            onClick={() => setSelectedCategory("active")}
            className={`px-6 py-2 rounded-full font-semibold transition transform hover:scale-105 ${
              selectedCategory === "active"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
          >
            En vote
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Titre de la battle avec effet */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-4">
            {battleTitle || "Battle en cours"}
          </h1>
          <p className="text-white/60 text-lg">
            {participants.length} participants • {participants.reduce((acc, p) => acc + p.total_votes, 0)} votes
          </p>
        </div>

        {/* Grille des participants */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-purple-500 animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredParticipants.map((p, index) => (
              <div
                key={p.id}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl overflow-hidden animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badge de rang avec animation */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    p.rank === 1 ? 'bg-yellow-400 text-yellow-900 animate-pulse' :
                    p.rank === 2 ? 'bg-gray-300 text-gray-900' :
                    p.rank === 3 ? 'bg-amber-600 text-amber-900' :
                    'bg-white/20 text-white'
                  }`}>
                    {getRankMedal(p.rank)}
                  </div>
                </div>

                {/* Image de profil avec effet */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <img
                    src={p.avatar_url}
                    alt={p.username}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  
                  {/* Overlay avec stats au survol */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 z-20 flex items-end justify-center pb-4">
                    <div className="text-white text-center">
                      <p className="font-bold text-lg">{p.username}</p>
                      <p className="text-sm opacity-90">{p.total_votes} votes</p>
                    </div>
                  </div>
                </div>

                {/* Informations */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 truncate">{p.username}</h3>
                  
                  {/* Barres de progression */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>Votes</span>
                        <span className="font-bold text-yellow-400">{p.total_votes}</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((p.total_votes / 100) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>Montant</span>
                        <span className="font-bold text-green-400">{formatAmount(p.total_amount)}</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((p.total_amount / 50000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bouton de vote avec animation */}
                  <div className="transform transition group-hover:scale-105">
                    <VoteButton participantId={p.id} />
                  </div>
                </div>

                {/* Effet de brillance */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition duration-1000" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message si aucun participant */}
        {!isLoading && filteredParticipants.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white/5 backdrop-blur-sm rounded-2xl">
              <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/50 text-xl">Aucun participant dans cette catégorie</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer avec stats */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-white/50 text-sm">Total Votes</p>
              <p className="text-2xl font-bold text-white">{participants.reduce((acc, p) => acc + p.total_votes, 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-sm">Montant total</p>
              <p className="text-2xl font-bold text-green-400">{formatAmount(participants.reduce((acc, p) => acc + p.total_amount, 0))}</p>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-sm">Participants</p>
              <p className="text-2xl font-bold text-white">{participants.length}</p>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-sm">Moyenne votes</p>
              <p className="text-2xl font-bold text-purple-400">
                {participants.length > 0 
                  ? Math.round(participants.reduce((acc, p) => acc + p.total_votes, 0) / participants.length)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
