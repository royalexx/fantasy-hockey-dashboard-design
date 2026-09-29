import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// In-memory cache so we only search each player once per server lifecycle
const idCache = new Map<string, string>()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get("name")?.trim()

  if (!name) {
    return NextResponse.redirect(new URL("/players/player-generic.png", req.url))
  }

  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // removes accents (e.g. Stützle -> Stutzle)

  if (idCache.has(cleanName)) {
    const cachedId = idCache.get(cleanName)!
    return NextResponse.redirect(`https://assets.nhle.com/mugs/nhl/latest/${cachedId}.png`, {
      headers: { "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400" },
    })
  }

  try {
    const nhlRes = await fetch(
      `https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=1&q=${encodeURIComponent(cleanName)}&active=true`,
      { headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" }, next: { revalidate: 86400 } }
    )

    if (nhlRes.ok) {
      const data = await nhlRes.json()
      const player = data?.[0]
      if (player?.playerId) {
        idCache.set(cleanName, String(player.playerId))
        return NextResponse.redirect(`https://assets.nhle.com/mugs/nhl/latest/${player.playerId}.png`, {
          headers: { "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400" },
        })
      }
    }
  } catch (err) {
    // Fall back to generic placeholder on search error
  }

  return NextResponse.redirect(new URL("/players/player-generic.png", req.url))
}