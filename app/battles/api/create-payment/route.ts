import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { participantId } = await req.json()

  // Ici tu dois créer le lien MoneyFusion côté serveur
  // Exemple mock :
  const payment_url = `https://moneyfusion.africa/pay?amount=100&participant=${participantId}`

  return NextResponse.json({ payment_url })
}
