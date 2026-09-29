"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { ChevronLeft, Heart, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { getPlayerDetail, getPlayerPhoto, type MarketPlayer, type Player, type PlayerStatus } from "@/lib/hockey-data"

const slotColors: Record<string, string> = {
  C: "bg-[#1d4ed8] text-white", LW: "bg-[#0d9488] text-white", RW: "bg-[#0d9488] text-white",
  D: "bg-[#b45309] text-white", G: "bg-[#0284c7] text-white",
}

export interface PlayerDialogTarget {
  name: string
  position: Player["position"]
  team: string
  opponent: string
  status: PlayerStatus
  todayPts: number | null
  projPts: number
  marketPlayer?: MarketPlayer
  owned?: boolean
  playerId?: string
  ownerName?: string
  tradeBlockNote?: string
}

type Tab = "summary" | "log" | "team" | "history"

export function PlayerDetailDialog({
  player, open, onOpenChange, onClaim, onSelectPlayer,
  tradeBlockActive, onToggleTradeBlock, onInitiateTrade,
}: {
  player: PlayerDialogTarget | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClaim?: (player: PlayerDialogTarget) => void
  onSelectPlayer?: (player: PlayerDialogTarget) => void
  tradeBlockActive?: boolean
  onToggleTradeBlock?: (player: PlayerDialogTarget) => void
  onInitiateTrade?: (player: PlayerDialogTarget) => void
}) {
  const [tab, setTab] = useState<Tab>("summary")
  const [favorite, setFavorite] = useState(false)
  const [watching, setWatching] = useState(false)
  const [reactions, setReactions] = useState({ "👍": 12, "🔥": 45, "💔": 2 })
  const detail = useMemo(() => player ? getPlayerDetail(player) : null, [player])
  if (!open || !player || !detail) return null
  const actionLabel = player.owned ? "DROP" : player.marketPlayer?.waiver === "FA" ? "+ ADD" : player.marketPlayer ? "+ CLAIM" : "TRADE"

  return <Sheet open={open} onOpenChange={(value) => { if (!value) { setTab("summary"); onOpenChange(false) } }}>
    <SheetContent side="bottom" className="mx-auto flex h-[90vh] max-h-[90vh] max-w-[430px] flex-col rounded-t-3xl border-t border-[#1a263d] bg-[#070a12] p-0 text-white outline-none">
      <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[#5e7090]" />
      <div className="flex shrink-0 items-center justify-between px-3 py-2">
        <button type="button" onClick={() => onOpenChange(false)} aria-label="Close player profile" className="rounded-full p-2 text-[#8ba0c7] transition-colors hover:bg-[#172338]"><ChevronLeft className="size-5" /></button>
        <div className="flex gap-1">{player.owned && onToggleTradeBlock && <button type="button" onClick={() => onToggleTradeBlock(player)} aria-label="Toggle trade block" className={cn("rounded-full border px-2 py-1 text-sm font-black transition-colors", tradeBlockActive ? "border-[#19ffff] bg-[#19ffff]/20 text-[#19ffff]" : "border-transparent text-[#5e7090] hover:bg-[#172338]")}>⇄</button>}<button type="button" onClick={() => setFavorite(!favorite)} aria-label="Favorite player" className={cn("rounded-full p-2 transition-colors hover:bg-[#172338]", favorite ? "text-amber-300" : "text-[#5e7090]")}><Star className="size-4" fill={favorite ? "currentColor" : "none"} /></button><button type="button" onClick={() => setWatching(!watching)} aria-label="Watchlist" className={cn("rounded-full p-2 transition-colors hover:bg-[#172338]", watching ? "text-[#ff2a85]" : "text-[#5e7090]")}><Heart className="size-4" fill={watching ? "currentColor" : "none"} /></button><button type="button" onClick={() => onOpenChange(false)} aria-label="Close"><X className="size-4 text-[#5e7090]" /></button></div>
      </div>
      <section className="shrink-0 bg-gradient-to-br from-[#0f172a] via-[#101d34] to-[#123246] px-4 pb-3 pt-1">
        <div className="flex items-end gap-3"><div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-[#19ffff]/60 bg-[#172338]"><img src={getPlayerPhoto(player.name)} alt={`${player.name} headshot`} className="size-full object-cover" onError={(e) => {(e.target as HTMLImageElement).src = "/players/player-generic.png"}}/></div><div className="min-w-0 flex-1 pb-1"><h1 className="truncate text-xl font-black">{player.name}</h1><p className="text-xs font-bold text-[#8ba0c7]">{player.team} · #? · {player.position}</p><div className="mt-1 flex items-center gap-1.5"><span className={cn("rounded px-2 py-0.5 text-[10px] font-black", slotColors[player.position])}>{player.position}</span>{player.status && <span className="rounded bg-[#ff2a85]/20 px-2 py-0.5 text-[10px] font-black text-[#ff2a85]">{player.status}</span>}</div></div><div className="text-right"><p className="text-xl font-black tabular-nums text-[#19ffff]">{player.todayPts?.toFixed(1) ?? "—"}</p><p className="text-[10px] text-[#8ba0c7]">proj {player.projPts.toFixed(1)}</p></div></div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-[10px] text-[#8ba0c7]"><span>AGE<b className="block text-xs text-white">{detail.bio.age}</b></span><span>HT/WT<b className="block text-xs text-white">{detail.bio.heightWeight}</b></span><span>EXP<b className="block text-xs text-white">{detail.bio.experience}</b></span><span>DRAFT<b className="block text-xs text-white">{detail.bio.draftShort}</b></span></div>
        {player.tradeBlockNote && !player.owned && <div className="mt-3 rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-center text-[10px] font-black text-amber-200">ON TRADE BLOCK · {player.tradeBlockNote}</div>}
        <div className="mt-3 flex gap-2"><button type="button" onClick={() => { if (actionLabel === "TRADE") { onOpenChange(false); onInitiateTrade?.(player) } else if (!player.owned && onClaim) { onOpenChange(false); onClaim(player) } }} className={cn("h-9 flex-1 rounded-full text-xs font-black transition-all hover:brightness-110 active:scale-[0.98]", player.owned ? "bg-[#3b1824] text-[#ff2a85]" : player.marketPlayer?.waiver === "FA" ? "bg-[#19ffff] text-[#080c14]" : player.marketPlayer ? "border border-[#19ffff]/50 bg-[#12283a] text-[#19ffff]" : "bg-[#172338] text-white")}>{actionLabel}</button></div>
      </section>
      <nav className="flex shrink-0 border-b border-[#172338] bg-[#0d1424]">{(["summary", "log", "team", "history"] as Tab[]).map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={cn("relative flex-1 py-3 text-[10px] font-black uppercase tracking-wide transition-colors", tab === item ? "text-[#19ffff]" : "text-[#5e7090] hover:text-white")}>{item === "log" ? "Game Log" : item}{tab === item && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#19ffff] shadow-[0_0_8px_#19ffff]" />}</button>)}</nav>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{tab === "summary" && <SummaryTab detail={detail} reactions={reactions} onReact={(key) => setReactions((current) => ({ ...current, [key]: current[key as keyof typeof current] + 1 }))} />}{tab === "log" && <GameLogTab detail={detail} goalie={player.position === "G"} />}{tab === "team" && <TeamTab detail={detail} player={player} onSelectPlayer={onSelectPlayer} />}{tab === "history" && <HistoryTab detail={detail} />}</div>
    </SheetContent>
  </Sheet>
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={cn("rounded-xl border border-[#172338] bg-[#101829] p-3", className)}>{children}</div> }
function SummaryTab({ detail, reactions, onReact }: { detail: ReturnType<typeof getPlayerDetail>; reactions: Record<string, number>; onReact: (key: string) => void }) {
  const game = detail.gameLog[0]
  return <div className="space-y-3"><div className="grid grid-cols-3 gap-2"><Card><p className="text-[9px] text-[#5e7090]">PLAYER RANK</p><b className="mt-1 block text-sm">#4 C</b><span className="text-[10px] text-[#8ba0c7]">#12 overall</span></Card><Card><p className="text-[9px] text-[#5e7090]">OWNERSHIP</p><b className="mt-1 block text-sm">98%</b><span className="text-[10px] text-[#8ba0c7]">94% started</span></Card><Card><p className="text-[9px] text-[#5e7090]">FPTS/GM</p><b className="mt-1 block text-sm text-[#19ffff]">{detail.seasonTotals.fptsPerGame}</b><span className="text-[10px] text-[#8ba0c7]">season avg</span></Card></div><Card><div className="flex items-center justify-between"><div><p className="text-[10px] font-black text-[#8ba0c7]">LAST GAME</p><p className="mt-1 text-xs font-bold">Final: COL 4 - BOS 2 · {game.date}</p></div><b className="text-lg text-[#19ffff]">{game.fpts} FPTS</b></div><p className="mt-3 text-xs text-[#8ba0c7]">{game.g} G · {game.a} A · {game.sog} SOG · {game.hits} HIT · {game.blk} BLK · {game.toi} TOI</p><div className="mt-3 flex gap-2">{Object.entries(reactions).map(([key, value]) => <button key={key} type="button" onClick={() => onReact(key)} className="rounded-full bg-[#172338] px-2.5 py-1 text-xs transition-transform hover:scale-105 active:scale-95">{key} {value}</button>)}</div></Card><Card><p className="text-[10px] font-black uppercase text-[#19ffff]">Recent Player News & Analysis</p><p className="mt-1 text-[10px] text-[#5e7090]">Today · Fantasy impact</p><h3 className="mt-1 text-sm font-bold">{detail.news.headline}</h3><p className="mt-1 text-xs leading-relaxed text-[#8ba0c7]">{detail.news.analysis}</p><p className="mt-2 text-[10px] font-bold text-[#5e7090]">• Elite volume floor  • Top-line deployment  • Strong matchup stream</p></Card><div><p className="mb-2 text-[10px] font-black uppercase text-[#5e7090]">Upcoming projections</p><div className="flex gap-2">{detail.projections.map((projection) => <Card key={projection.week} className="min-w-[92px] text-center"><p className="text-[10px] text-[#5e7090]">{projection.week}</p><b className="text-lg text-[#19ffff]">{projection.fpts}</b></Card>)}</div></div></div>
}

function GameLogTab({ detail, goalie }: { detail: ReturnType<typeof getPlayerDetail>; goalie: boolean }) { const [season, setSeason] = useState("2025-26"); return <div className="space-y-4"><div className="flex gap-2">{["2025-26", "2024-25"].map((year) => <button key={year} type="button" onClick={() => setSeason(year)} className={cn("rounded-full px-2.5 py-1 text-[10px] font-black", season === year ? "bg-[#19ffff] text-[#080c14]" : "bg-[#172338] text-[#8ba0c7]")}>{year}</button>)}</div><Card className="overflow-x-auto p-0"><table className="w-full min-w-[620px] text-left text-[9px]"><thead className="sticky top-0 z-10 bg-[#172338] text-[#5e7090]"><tr>{(goalie ? ["DATE", "OPP", "DEC", "FPTS", "TOI", "GA", "SV", "SV%", "SO"] : ["DATE", "OPP", "RESULT", "FPTS", "TOI", "G", "A", "SOG", "HIT", "BLK", "+ / -"]).map((head) => <th key={head} className="px-2 py-2 font-black">{head}</th>)}</tr></thead><tbody>{detail.gameLog.map((game) => <tr key={`${season}-${game.date}`} className="border-t border-[#172338]"><td className="px-2 py-2 text-white">{game.date}</td><td className="px-2">{game.opp}</td><td className="px-2">{goalie ? game.decision : game.result}</td><td className={cn("px-2 font-black text-[#19ffff]", game.fpts > 15 && "rounded bg-emerald-400/10")}>{game.fpts}</td>{goalie ? <><td className="px-2">{game.toi}</td><td className="px-2">{game.ga}</td><td className="px-2">{game.saves}</td><td className="px-2">{game.svPct}</td><td className="px-2">{game.shutout ? "1" : "0"}</td></> : <><td className="px-2">{game.toi}</td><td className="px-2">{game.g}</td><td className="px-2">{game.a}</td><td className="px-2">{game.sog}</td><td className="px-2">{game.hits}</td><td className="px-2">{game.blk}</td><td className="px-2">{game.plusMinus}</td></>}</tr>)}</tbody></table></Card></div> }

function TeamTab({ detail, player, onSelectPlayer }: { detail: ReturnType<typeof getPlayerDetail>; player: PlayerDialogTarget; onSelectPlayer?: (player: PlayerDialogTarget) => void }) { return <div className="space-y-4"><div className="flex gap-2 overflow-x-auto">{detail.teamRanks.map((rank) => <span key={rank.label} className="rounded-full bg-[#172338] px-3 py-1.5 text-[10px] font-black text-[#8ba0c7]">{rank.label} <b className="text-white">{rank.value}</b></span>)}</div><Card><p className="mb-3 text-[10px] font-black uppercase text-[#5e7090]">NHL Depth Chart · {player.team}</p>{detail.depthChart.map((line) => <div key={line.line} className="mb-3"><p className="mb-1 text-[9px] font-black text-[#5e7090]">{line.line}</p><div className={cn("grid gap-1", line.slots.length >= 5 ? "grid-cols-5" : line.slots.length === 4 ? "grid-cols-4" : "grid-cols-3")}>{line.slots.map((slot) => <button key={`${line.line}-${slot.label}-${slot.name}`} type="button" onClick={() => { if (slot.name === player.name) return; const position = slot.label === "LD" || slot.label === "RD" ? "D" : slot.label === "STARTER" || slot.label === "BACKUP" ? "G" : slot.label === "LW" ? "LW" : slot.label === "RW" ? "RW" : "C"; onSelectPlayer?.({ ...player, name: slot.name, position }) }} className={cn("rounded-md border px-2 py-2 text-left text-[10px] font-bold transition-colors", slot.name === player.name ? "border-2 border-[#19ffff] bg-[#19ffff]/10 text-[#19ffff] shadow-[0_0_12px_rgba(25,255,255,0.4)]" : "border-[#263858] bg-[#0d1424] text-white hover:border-[#19ffff]/50")}>{slot.label}<span className="block truncate text-[9px] text-[#8ba0c7]">{slot.name}</span></button>)}</div></div>)}</Card></div> }

function HistoryTab({ detail }: { detail: ReturnType<typeof getPlayerDetail> }) { return <div className="space-y-3"><Card><p className="text-[10px] font-black uppercase text-[#5e7090]">Dynasty Acquisition</p><p className="mt-2 text-sm font-bold">{detail.transactions[0].description}</p><p className="mt-1 text-[10px] text-[#8ba0c7]">{detail.transactions[0].date}</p></Card><Card className="overflow-x-auto p-0"><table className="w-full min-w-[520px] text-left text-[10px]"><thead className="bg-[#172338] text-[#5e7090]"><tr>{["Season", "Team", "GP", "G", "A", "PTS", "FPTS", "Rank"].map((head) => <th key={head} className="px-2 py-2">{head}</th>)}</tr></thead><tbody>{detail.pastSeasons.map((season) => <tr key={season.season} className="border-t border-[#172338]"><td className="px-2 py-2">{season.season}</td><td className="px-2">{season.team}</td><td className="px-2">{season.gp}</td><td className="px-2">{season.g}</td><td className="px-2">{season.a}</td><td className="px-2">{season.pts}</td><td className="px-2 text-[#19ffff]">{season.fpts}</td><td className="px-2">{season.rank}</td></tr>)}</tbody></table></Card></div> }
