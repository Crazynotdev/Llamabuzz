import { serve } from "https://deno.land/std@0.201.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

serve(async (req) => {
  try {
    const body = await req.json()
    const { transaction_id, participant_id, amount, status } = body

    if (status !== "success") {
      return new Response("Payment failed", { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // Vérifier si le vote existe déjà
    const { data: existing } = await supabase
      .from("votes")
      .select("id")
      .eq("transaction_id", transaction_id)
      .single()

    if (existing) {
      return new Response("Vote already processed", { status: 200 })
    }

    // Créer le vote
    const { error: insertError } = await supabase.from("votes").insert({
      participant_id,
      transaction_id,
      amount,
      status: "confirmed"
    })

    if (insertError) return new Response("Error inserting vote", { status: 500 })

    // Appeler la fonction pour incrémenter total_votes et prize_pool
    const { error: rpcError } = await supabase.rpc("increment_vote", {
      participant_id_input: participant_id,
      amount_input: amount
    })

    if (rpcError) return new Response("Error incrementing vote", { status: 500 })

    return new Response("Vote processed", { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response("Internal error", { status: 500 })
  }
})
