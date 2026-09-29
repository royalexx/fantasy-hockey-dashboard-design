import fs from "node:fs"
import path from "node:path"

const OUTPUT_PATH = path.join(process.cwd(), "public", "data", "nhl-players.json")

function normalizePosition(code) {
  if (code === "L") return "LW"
  if (code === "R") return "RW"
  if (code === "D") return "D"
  if (code === "G") return "G"
  return "C"
}

async function fetchDynastyPool() {
  console.log("🏒 Fetching complete NHL player & prospect pool...")
  const playerMap = new Map()

  // 1. Fetch all active/contracted NHL players (skaters + goalies)
  try {
    const res = await fetch(
      "https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=5000&q=*&active=true",
      { headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" } }
    )
    if (res.ok) {
      const data = await res.json()
      for (const p of data) {
        if (!p.playerId || !p.name) continue
        const position = normalizePosition(p.positionCode)
        playerMap.set(String(p.playerId), {
          id: `nhl-${p.playerId}`,
          nhlId: Number(p.playerId),
          name: p.name,
          team: p.teamAbbrev || p.lastTeamAbbrev || "NHL",
          position,
          slot: position === "LW" || position === "RW" ? "W" : position,
          projPts: position === "G" ? 12.5 : position === "D" ? 9.8 : 11.2,
          todayPts: null,
          waiver: "FA",
          opponent: "—",
          headshot: `https://assets.nhle.com/mugs/nhl/latest/${p.playerId}.png`,
        })
      }
      console.log(`✅ Loaded ${playerMap.size} active NHL players.`)
    }
  } catch (err) {
    console.error("Failed to fetch active player index:", err)
  }

  // 2. Fetch the latest Entry Draft picks (for young dynasty prospects)
  try {
    const draftRes = await fetch("https://api-web.nhle.com/v1/draft/picks/now", {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    })
    if (draftRes.ok) {
      const draftData = await draftRes.json()
      let draftCount = 0
      for (const pick of draftData?.picks ?? []) {
        if (!pick.playerId) continue
        const idStr = String(pick.playerId)
        const name = `${pick.firstName?.default || ""} ${pick.lastName?.default || ""}`.trim()
        const position = normalizePosition(pick.positionCode)

        if (!playerMap.has(idStr)) {
          playerMap.set(idStr, {
            id: `nhl-${pick.playerId}`,
            nhlId: Number(pick.playerId),
            name: name || pick.pickSummary || "Draft Prospect",
            team: pick.teamAbbrev || "NHL",
            position,
            slot: position === "LW" || position === "RW" ? "W" : position,
            projPts: 8.5,
            todayPts: null,
            waiver: "WAI",
            opponent: "—",
            headshot: `https://assets.nhle.com/mugs/nhl/latest/${pick.playerId}.png`,
          })
          draftCount++
        }
      }
      console.log(`✅ Loaded ${draftCount} additional draft prospects.`)
    }
  } catch (err) {
    console.error("Draft prospects endpoint unavailable, continuing with active roster.")
  }

  const allPlayers = Array.from(playerMap.values()).sort((a, b) => a.name.localeCompare(b.name))

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allPlayers, null, 2))
  console.log(`🎉 Saved ${allPlayers.length} total dynasty players to public/data/nhl-players.json`)
}

fetchDynastyPool()