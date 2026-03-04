import Layout from "@/components/Layout"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { 
  Sword, 
  Trophy, 
  Users, 
  Clock, 
  Flame, 
  Crown, 
  Sparkles,
  TrendingUp,
  Medal,
  Coins,
  Calendar,
  Eye,
  ChevronRight,
  Zap,
  Star,
  Award,
  Target
} from "lucide-react"

export default function Home() {
  const [battles, setBattles] = useState<any[]>([])
  const [featuredBattles, setFeaturedBattles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBattles: 0,
    activeBattles: 0,
    totalParticipants: 0,
    totalPrizePool: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      // Récupérer toutes les battles
      const { data: battlesData } = await supabase
        .from("battles")
        .select("*")
        .order("created_at", { ascending: false })
      
      setBattles(battlesData || [])
      
      // Récupérer les battles en vedette (ex: les plus populaires)
      const { data: featured } = await supabase
        .from("battles")
        .select("*")
        .eq("status", "active")
        .order("participants_count", { ascending: false })
        .limit(3)
      
      setFeaturedBattles(featured || [])
      
      // Calculer les stats
      if (battlesData) {
        const active = battlesData.filter(b => b.status === "active").length
        const totalParticipants = battlesData.reduce((acc, b) => acc + (b.participants_count || 0), 0)
        const totalPrize = battlesData.reduce((acc, b) => acc + (b.prize_pool || 0), 0)
        
        setStats({
          totalBattles: battlesData.length,
          activeBattles: active,
          totalParticipants: totalParticipants,
          totalPrizePool: totalPrize
        })
      }
      
      setLoading(false)
    }

    fetchData()

    // Souscription en temps réel pour les mises à jour
    const subscription = supabase
      .channel('battles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'battles' }, 
        () => fetchData()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Formater le montant
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  // Obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500",
      pending: "bg-yellow-500",
      completed: "bg-gray-500",
      cancelled: "bg-red-500"
    }
    return colors[status as keyof typeof colors] || "bg-purple-500"
  }

  // Obtenir l'icône du statut
  const getStatusIcon = (status: string) => {
    const icons = {
      active: <Flame className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      completed: <Trophy className="w-3 h-3" />,
      cancelled: <Target className="w-3 h-3" />
    }
    return icons[status as keyof typeof icons] || <Sword className="w-3 h-3" />
  }

  return (
    <Layout>
      {/* Hero Section avec animations */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-8 md:p-12 mb-12">
        {/* Éléments décoratifs animés */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        
        {/* Particules */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <span className="text-sm font-semibold uppercase tracking-wider text-yellow-300">
              Bienvenue sur LLAMABUZZ
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            L'Arène des
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Champions
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
            Rejoignez des battles épiques, affrontez les meilleurs et remportez des prix exceptionnels. La communauté décide du vainqueur !
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/battles"
              className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Explorer les battles</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/how-it-works"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 border border-white/20"
            >
              <Eye className="w-5 h-5" />
              <span>Comment ça marche</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { 
            label: "Battles actives", 
            value: stats.activeBattles, 
            icon: Sword, 
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50"
          },
          { 
            label: "Participants", 
            value: stats.totalParticipants, 
            icon: Users, 
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50"
          },
          { 
            label: "Prize Pool total", 
            value: formatAmount(stats.totalPrizePool), 
            icon: Coins, 
            color: "from-yellow-500 to-orange-500",
            bgColor: "bg-yellow-50",
            isAmount: true
          },
          { 
            label: "En direct", 
            value: stats.activeBattles, 
            icon: TrendingUp, 
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50"
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Effet de fond au survol */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              <div className="relative">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.isAmount ? 'text-green-600' : 'text-gray-800'}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          )
        })}
      </section>

      {/* Battles en vedette */}
      {featuredBattles.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <span>Battles à la une</span>
            </h2>
            
            <Link 
              href="/battles" 
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center space-x-1 group"
            >
              <span>Voir tout</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBattles.map((battle, index) => (
              <Link
                key={battle.id}
                href={`/battles/${battle.id}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fadeInUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image de fond */}
                {battle.cover_image && (
                  <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-500">
                    <img 
                      src={battle.cover_image} 
                      alt={battle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Contenu */}
                <div className="relative p-6 h-full flex flex-col justify-end">
                  {/* Badge statut */}
                  <div className="absolute top-4 right-4">
                    <span className={`${getStatusColor(battle.status)} text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg`}>
                      {getStatusIcon(battle.status)}
                      <span className="ml-1">{battle.status}</span>
                    </span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {battle.title}
                  </h3>

                  {/* Description */}
                  {battle.description && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {battle.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{battle.participants_count || 0} participants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="font-bold text-yellow-400">
                        {formatAmount(battle.prize_pool || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progression</span>
                      <span>{Math.min(Math.round(((battle.participants_count || 0) / 20) * 100), 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(((battle.participants_count || 0) / 20) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Toutes les battles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Sword className="w-6 h-6 text-purple-600" />
            <span>Toutes les battles</span>
          </h2>

          {/* Filtres rapides */}
          <div className="flex space-x-2">
            {["Toutes", "Actives", "Terminées"].map((filter, index) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  index === 0 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sword className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {battles.map((battle, index) => (
              <Link
                key={battle.id}
                href={`/battles/${battle.id}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* En-tête avec gradient */}
                <div className={`h-2 bg-gradient-to-r ${
                  battle.status === 'active' ? 'from-green-500 to-emerald-500' :
                  battle.status === 'pending' ? 'from-yellow-500 to-orange-500' :
                  battle.status === 'completed' ? 'from-gray-500 to-gray-600' :
                  'from-purple-500 to-pink-500'
                }`} />

                <div className="p-6">
                  {/* Status et date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      battle.status === 'active' ? 'bg-green-100 text-green-700' :
                      battle.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      battle.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {getStatusIcon(battle.status)}
                      <span>{battle.status}</span>
                    </span>
                    
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(battle.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {battle.title}
                  </h3>

                  {/* Description */}
                  {battle.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {battle.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center group-hover:bg-purple-50 transition-colors">
                      <Users className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Participants</p>
                      <p className="font-bold text-gray-800">{battle.participants_count || 0}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 text-center group-hover:bg-purple-50 transition-colors">
                      <Coins className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Prize Pool</p>
                      <p className="font-bold text-green-600">{formatAmount(battle.prize_pool || 0)}</p>
                    </div>
                  </div>

                  {/* Bouton voir détails */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-600 font-semibold group-hover:underline">
                      Voir les détails
                    </span>
                    <ChevronRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && battles.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-gray-50 rounded-2xl">
              <Sword className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune battle pour le moment</p>
              <p className="text-gray-400 text-sm">Revenez plus tard !</p>
            </div>
          </div>
        )}
      </section>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </Layout>
  )
}
