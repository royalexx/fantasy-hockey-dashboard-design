import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

export const runtime = "nodejs"

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "data", "nhl-players.json")

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8")
    return new NextResponse(raw, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    })
  }

  // Fallback: Fetch directly if JSON file is not yet built
  try {
    const res = await fetch(
      "https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=3000&q=*&active=true",
      { headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" } }
    )
    const data = await res.json()
    const players = (data ?? []).map((p: any) => ({
      id: `nhl-${p.playerId}`,
      nhlId: Number(p.playerId),
      name: p.name,
      team: p.teamAbbrev || p.lastTeamAbbrev || "NHL",
      position: p.positionCode === "L" ? "LW" : p.positionCode === "R" ? "RW" : p.positionCode || "C",
      slot: p.positionCode === "D" ? "D" : p.positionCode === "G" ? "G" : "W",
      projPts: 10.0,
      todayPts: null,
      waiver: "FA",
      opponent: "—",
      headshot: `https://assets.nhle.com/mugs/nhl/latest/${p.playerId}.png`,
    }))

    return NextResponse.json(players, {
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200" },
    })
  } catch (err) {
    return NextResponse.json({ error: "Failed to load players" }, { status: 500 })
  }
}