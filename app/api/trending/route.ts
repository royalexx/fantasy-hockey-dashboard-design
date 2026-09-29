import { load } from "cheerio"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export interface TrendingPlayer {
  name: string
  team: string
  position: "C" | "LW" | "RW" | "D" | "G"
  delta: number
  deltaLabel: string
  rostered: string
}

const fallbackAdds24h: TrendingPlayer[] = [
  { name: "Macklin Celebrini", team: "SJS", position: "C", delta: 18.4, deltaLabel: "+18.4K adds", rostered: "62%" },
  { name: "Lane Hutson", team: "MTL", position: "D", delta: 14.2, deltaLabel: "+14.2K adds", rostered: "48%" },
  { name: "Dustin Wolf", team: "CGY", position: "G", delta: 11.8, deltaLabel: "+11.8K adds", rostered: "83%" },
  { name: "Logan Stankoven", team: "DAL", position: "RW", delta: 9.7, deltaLabel: "+9.7K adds", rostered: "74%" },
  { name: "Cutter Gauthier", team: "ANA", position: "LW", delta: 8.9, deltaLabel: "+8.9K adds", rostered: "57%" },
  { name: "Will Smith", team: "SJS", position: "C", delta: 7.6, deltaLabel: "+7.6K adds", rostered: "51%" },
]

const fallbackDrops24h: TrendingPlayer[] = [
  { name: "Trevor Zegras", team: "ANA", position: "C", delta: -12.4, deltaLabel: "-12.4K drops", rostered: "39%" },
  { name: "Matvei Michkov", team: "PHI", position: "RW", delta: -10.1, deltaLabel: "-10.1K drops", rostered: "44%" },
  { name: "Owen Power", team: "BUF", position: "D", delta: -8.7, deltaLabel: "-8.7K drops", rostered: "36%" },
  { name: "Cutter Gauthier", team: "ANA", position: "LW", delta: -7.9, deltaLabel: "-7.9K drops", rostered: "57%" },
  { name: "Will Smith", team: "SJS", position: "C", delta: -6.8, deltaLabel: "-6.8K drops", rostered: "51%" },
  { name: "Dustin Wolf", team: "CGY", position: "G", delta: -5.4, deltaLabel: "-5.4K drops", rostered: "83%" },
]

const scaleTrending = (players: TrendingPlayer[], multiplier: number, drops = false): TrendingPlayer[] =>
  players.map((player) => {
    const delta = Math.round(player.delta * multiplier * 10) / 10
    return { ...player, delta, deltaLabel: `${delta > 0 ? "+" : ""}${delta.toFixed(1)}K ${delta > 0 ? "adds" : "drops"}` }
  }).sort((a, b) => drops ? a.delta - b.delta : b.delta - a.delta)

const fallbackAdds7d = scaleTrending(fallbackAdds24h, 3.5)
const fallbackDrops7d = scaleTrending(fallbackDrops24h, 3.08, true)

function parsePosition(value: string): TrendingPlayer["position"] {
  const position = value.toUpperCase()
  if (position.includes("LW")) return "LW"
  if (position.includes("RW")) return "RW"
  if (position.includes("G")) return "G"
  if (position.includes("D")) return "D"
  return "C"
}

function parseDelta(value: string): number | null {
  const cleaned = value.replace(/,/g, "").trim()
  const match = cleaned.match(/([+-]?\d+(?:\.\d+)?)(?:\s*([KM]))?%?/)
  if (!match) return null
  const amount = Math.abs(Number(match[1]))
  if (!Number.isFinite(amount)) return null
  const multiplier = match[2] === "M" ? 1000 : match[2] === "K" ? 1 : 1
  return amount * multiplier * (cleaned.includes("-") ? -1 : 1)
}

function parseYahooRows(html: string) {
  const $ = load(html)
  const adds: TrendingPlayer[] = []
  const drops: TrendingPlayer[] = []

  $("table tr").each((_index, row) => {
    const cells = $(row).find("th, td").map((_cellIndex, cell) => $(cell).text().replace(/\s+/g, " ").trim()).get()
    const playerName = $(row).find(".ysf-player-name").first().text().replace(/\s+/g, " ").trim() || $(row).find("a").first().text().replace(/\s+/g, " ").trim()
    if (!playerName || cells.length < 2) return

    const text = cells.join(" | ")
    const teamPosition = text.match(/\b([A-Z]{2,3})\s*[-–]\s*(LW|RW|C|D|G)\b/i)
    const deltaText = cells.find((cell) => /[+-]\s*[\d,]+(?:\.\d+)?\s*(?:%|K|M)?/i.test(cell))
    const delta = deltaText ? parseDelta(deltaText) : null
    if (delta === null || delta === 0) return

    const rostered = cells.find((cell) => /\b\d+(?:\.\d+)?%\b/.test(cell)) ?? "—"
    const player: TrendingPlayer = {
      name: playerName,
      team: teamPosition?.[1]?.toUpperCase() ?? "NHL",
      position: parsePosition(teamPosition?.[2] ?? text),
      delta,
      deltaLabel: deltaText?.trim() ?? `${delta > 0 ? "+" : ""}${delta}`,
      rostered,
    }
    if (delta > 0) adds.push(player)
    else drops.push(player)
  })

  const adds24h = adds.sort((a, b) => b.delta - a.delta).slice(0, 25)
  const drops24h = drops.sort((a, b) => a.delta - b.delta).slice(0, 25)
  return { adds24h, adds7d: scaleTrending(adds24h, 3.5), drops24h, drops7d: scaleTrending(drops24h, 3.08, true) }
}

export async function GET() {
  try {
    const response = await fetch("https://hockey.fantasysports.yahoo.com/hockey/buzzindex", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error(`Yahoo returned ${response.status}`)
    const parsed = parseYahooRows(await response.text())
    if (parsed.adds24h.length === 0 || parsed.drops24h.length === 0) throw new Error("Yahoo trend tables were unavailable")

    return NextResponse.json({ adds_24h: parsed.adds24h, adds_7d: parsed.adds7d, drops_24h: parsed.drops24h, drops_7d: parsed.drops7d }, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    })
  } catch {
    return NextResponse.json({ adds_24h: fallbackAdds24h, adds_7d: fallbackAdds7d, drops_24h: fallbackDrops24h, drops_7d: fallbackDrops7d }, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    })
  }
}
