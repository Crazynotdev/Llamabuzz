"use client"
import { useState } from "react"

interface VoteButtonProps {
  participantId: string
}

export default function VoteButton({ participantId }: VoteButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleVote = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        body: JSON.stringify({ participantId }),
      })
      const { payment_url } = await res.json()
      window.open(payment_url, "_blank")
    } catch (err) {
      console.error(err)
      alert("Erreur paiement, réessayez.")
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    >
      {loading ? "Processing..." : "Voter 100 FCFA"}
    </button>
  )
}
