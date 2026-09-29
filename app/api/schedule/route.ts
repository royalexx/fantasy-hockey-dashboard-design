import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const res = await fetch("https://api-web.nhle.com/v1/schedule/now", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 60 }, // Cache on Vercel Edge for 60 seconds
    })

    if (!res.ok) {
      throw new Error(`NHL API error: ${res.status}`)
    }

    const data = await res.json()
    const today = data?.gameWeek?.[0] ?? null

    const games = (today?.games ?? []).map((game: any) => ({
      id: game.id,
      gameState: game.gameState, // "FUT" (Pre-game), "LIVE", "FINAL"
      startTimeUTC: game.startTimeUTC,
      awayTeam: {
        abbrev: game.awayTeam.abbrev,
        score: game.awayTeam.score ?? 0,
        logo: game.awayTeam.logo,
      },
      homeTeam: {
        abbrev: game.homeTeam.abbrev,
        score: game.homeTeam.score ?? 0,
        logo: game.homeTeam.logo,
      },
      period: game.periodDescriptor?.number ?? null,
      clock: game.clock?.timeRemaining ?? null,
    }))

    return NextResponse.json({
      date: today?.date,
      games,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Could not retrieve live NHL schedule", games: [] },
      { status: 500 }
    )
  }
}