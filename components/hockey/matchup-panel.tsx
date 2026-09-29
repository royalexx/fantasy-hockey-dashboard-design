"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getTeamRoster,
  weekMatchups,
  type MatchupSummary,
  type MatchupPlayer,
  type Player,
} from "@/lib/hockey-data"
import { LineupSlotDialog } from "@/components/hockey/lineup-slot-dialog"
import { MatchupBanner } from "@/components/hockey/matchup-banner"
import { PlayerDetailDialog, type PlayerDialogTarget } from "@/components/hockey/player-detail-dialog"
import { PlayerRow } from "@/components/hockey/player-row"

type StartingSlot = Extract<Player["slot"], "C" | "W" | "F" | "D" | "G">
type ReserveSlot = "BN" | "TAXI" | "IR"
const slotCapacities: Record<StartingSlot, number> = { C: 3, W: 6, F: 3, D: 6, G: 2 }
const slotGroups: StartingSlot[] = ["C", "W", "F", "D", "G"]
const slotColors: Record<StartingSlot, string> = {
  C: "bg-[#3b4cca]",
  W: "bg-[#0d9488]",
  F: "bg-[#7c3aed]",
  D: "bg-[#b45309]",
  G: "bg-[#0284c7]",
}
const statusStyles: Record<string, string> = {
  IR: "bg-[#3b1824] text-[#ff2a85]",
  TAXI: "bg-[#1a253b] text-[#5e7090]",
  O: "bg-[#3b1824] text-[#ff2a85]",
  DTD: "bg-amber-400/15 text-amber-300",
}

const opponentReserves: Record<string, Record<ReserveSlot, MatchupPlayer[]>> = {
  m1: {
    BN: [
      { name: "John Tavares", position: "C", team: "TOR", opponent: "@ OTT", status: null, todayPts: null, projPts: 13.4 },
      { name: "William Nylander", position: "RW", team: "TOR", opponent: "@ OTT", status: null, todayPts: null, projPts: 17.3 },
    ],
    TAXI: [{ name: "Easton Cowan", position: "RW", team: "TOR", opponent: "@ OTT", status: "TAXI", todayPts: null, projPts: 9.8 }],
    IR: [{ name: "Max Domi", position: "C", team: "TOR", opponent: "@ OTT", status: "IR", todayPts: null, projPts: 0 }],
  },
  m2: { BN: [], TAXI: [], IR: [] },
  m3: { BN: [], TAXI: [], IR: [] },
}

function toDialogPlayer(player: MatchupPlayer): PlayerDialogTarget {
  return {
    name: player.name,
    position: player.position,
    team: player.team,
    opponent: player.opponent,
    status: player.status,
    todayPts: player.todayPts,
    projPts: player.projPts,
  }
}

export function getYetToPlayText(teamRoster: Player[]): string {
    const counts: Record<"C" | "W" | "F" | "D" | "G", number> = { C: 0, W: 0, F: 0, D: 0, G: 0 }
    teamRoster
      .filter((player) => ["C", "W", "F", "D", "G"].includes(player.slot))
      .filter((player) => player.gameState !== "Final" && player.status !== "O" && player.status !== "IR")
      .forEach((player) => {
        const group = player.slot
        if (group in counts) counts[group as keyof typeof counts] += 1
      })
    const parts = (Object.keys(counts) as Array<keyof typeof counts>)
      .filter((slot) => counts[slot] > 0)
      .map((slot) => `${counts[slot]} ${slot}`)
    return `yet to play: ${parts.length ? parts.join(", ") : "none"}`
  }

function emptyPlayer(slot: StartingSlot): MatchupPlayer {
  return {
    name: "",
    position: slot === "W" || slot === "F" ? "C" : slot,
    team: "",
    opponent: "",
    status: null,
    todayPts: null,
    projPts: 0,
    empty: true,
  }
}

function PlayerSide({
  player,
  align,
  onSelect,
  nickname,
}: {
  player: MatchupPlayer
  align: "left" | "right"
  onSelect: (player: MatchupPlayer) => void
  nickname?: string
}) {
  if (player.empty) {
    return <div className={cn("min-w-0 text-xs text-[#5e7090]", align === "left" ? "text-right" : "text-left")}>Empty slot</div>
  }
  return (
    <button
      type="button"
      onClick={() => onSelect(player)}
      className={cn("min-w-0 rounded-md px-1 py-1 text-left hover:bg-[#101a2e]", align === "left" ? "text-right" : "text-left")}
    >
      <div className={cn("flex items-center gap-1.5", align === "left" ? "justify-end" : "justify-start")}>
        <span className="truncate text-xs font-bold text-white">{player.name}</span>
        {player.status && <span className={cn("rounded px-1 py-0.5 text-[9px] font-black", statusStyles[player.status])}>{player.status}</span>}
      </div>
      {nickname && <p className="truncate text-[10px] italic text-[#5e7090]">{nickname}</p>}
      <p className="truncate text-[10px] text-[#5e7090]">
        {player.todayPts == null ? `7:00 PM ${player.opponent}` : `LIVE W 4-2 ${player.opponent}`} · {player.team}
      </p>
    </button>
  )
}

function Score({ player, align }: { player: MatchupPlayer; align: "left" | "right" }) {
  return (
    <div className={cn("shrink-0", align === "left" ? "text-right" : "text-left")}>
      <p className="text-sm font-bold tabular-nums text-white">{player.todayPts == null ? "—" : player.todayPts.toFixed(2)}</p>
      <p className="text-[10px] tabular-nums text-[#5e7090]">proj {player.projPts.toFixed(2)}</p>
    </div>
  )
}

function PlayerStats({ player, align }: { player: MatchupPlayer; align: "left" | "right" }) {
  const stats = player.position === "G"
    ? "W 1, 28 SV, 1 SO"
    : player.position === "D"
      ? "1 A, 3 SOG, 2 BLK"
      : "1 G, 2 A, 4 SOG"
  return (
    <p className={cn("truncate text-[9px] text-[#5e7090]", align === "left" ? "text-right" : "text-left")}>
      {stats}
    </p>
  )
}

function LiveTicker({ event, delta, homeRoster, awayRoster }: { event: string; delta: string; homeRoster: Player[]; awayRoster: Player[] }) {
  return (
    <div className="border-b border-[#111929] bg-[#0d1424] px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[10px] font-semibold text-[#8ba0c7]">
          <span className="text-[#19ffff]">P2 14:22</span>
          {" • "}
          {event}
        </p>
        <span className="shrink-0 animate-pulse rounded-full border border-[#19ffff]/50 bg-[#19ffff]/10 px-2 py-1 text-[10px] font-black text-[#19ffff]">{delta}</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[9px] font-bold text-[#5e7090]">
        <span>◉ {getYetToPlayText(homeRoster)}</span>
        <span className="text-right">◉ {getYetToPlayText(awayRoster)}</span>
      </div>
    </div>
  )
}

function WinBar({ homePct }: { homePct: number }) {
  const awayPct = 100 - homePct
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px] font-black tabular-nums">
        <span className="text-[#19ffff]">{homePct}% WIN</span>
        <span className="text-[#ff2a85]">{awayPct}% WIN</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-[#172338]">
        <div className="bg-[#19ffff]" style={{ width: `${homePct}%` }} />
        <div className="bg-[#ff2a85]" style={{ width: `${awayPct}%` }} />
      </div>
    </div>
  )
}

function TeamAvatar({ team, magenta = false }: { team: string; magenta?: boolean }) {
  return <div className={cn("flex size-9 items-center justify-center rounded-full border text-[10px] font-black", magenta ? "border-[#ff2a85]/40 bg-[#ff2a85]/10 text-[#ff2a85]" : "border-[#19ffff]/40 bg-[#19ffff]/10 text-[#19ffff]")}><Shield className="mr-0.5 size-3.5" />{team.slice(0, 3).toUpperCase()}</div>
}

function MatchupCard({ summary, onClick }: { summary: (typeof weekMatchups)[number]; onClick: () => void }) {
  const projectedHome = summary.homeScore + 12
  const projectedAway = summary.awayScore + 8
  const homePct = Math.round((projectedHome / (projectedHome + projectedAway)) * 100)
  return (
    <button type="button" onClick={onClick} className="w-full rounded-xl border border-[#172338] bg-[#0d1424] p-3.5 text-left transition-colors hover:bg-[#101a2e]">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><TeamAvatar team={summary.homeTeam} /><span className="truncate text-xs font-bold text-white">{summary.homeTeam}</span></div>
          <p className="mt-1 pl-11 text-[10px] text-[#5e7090]">{summary.homeOwner} · {summary.homeRecord}</p>
        </div>
        <span className="rounded bg-[#172338] px-2 py-1 text-[10px] font-black text-[#5e7090]">VS</span>
        <div className="min-w-0 flex-1 text-right">
          <div className="flex items-center justify-end gap-2"><span className="truncate text-xs font-bold text-white">{summary.awayTeam}</span><TeamAvatar team={summary.awayTeam} magenta /></div>
          <p className="mt-1 pr-11 text-[10px] text-[#5e7090]">{summary.awayRecord} · {summary.awayOwner}</p>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div><p className="text-2xl font-black tabular-nums text-white">{summary.homeScore.toFixed(2)}</p><p className="text-[10px] text-[#5e7090]">proj {projectedHome.toFixed(2)}</p></div>
        <div className="text-right"><p className="text-2xl font-black tabular-nums text-white">{summary.awayScore.toFixed(2)}</p><p className="text-[10px] text-[#5e7090]">proj {projectedAway.toFixed(2)}</p></div>
      </div>
      <div className="mt-3"><WinBar homePct={homePct} /></div>
    </button>
  )
}

function Reserves({
  roster,
  opponent,
  teamName,
  opponentName,
  onEdit,
}: {
  roster: Player[]
  opponent: Record<ReserveSlot, MatchupPlayer[]>
  teamName: string
  opponentName: string
  onEdit: (player: Player) => void
}) {
  const [open, setOpen] = useState(true)
  const groups: Array<{ slot: ReserveSlot; label: string }> = [
    { slot: "BN", label: "Bench" },
    { slot: "TAXI", label: "Taxi Squad" },
    { slot: "IR", label: "Injured Reserve" },
  ]
  return (
    <section className="overflow-hidden border-y border-[#111929] bg-[#080c14]">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-center justify-between border-b border-[#111929] px-3 py-3 text-left">
        <span><b className="block text-sm text-white">Bench & Reserves</b><small className="text-[10px] text-[#5e7090]">BN · TAXI · IR</small></span>
        <ChevronDown className={cn("size-5 text-[#5e7090] transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="grid grid-cols-2 border-b border-[#111929] px-3 py-2 text-[10px] font-bold text-[#5e7090]"><span>{teamName}</span><span className="text-right">{opponentName}</span></div>
          {groups.map(({ slot, label }) => {
            const home = roster.filter((player) => player.slot === slot)
            const away = opponent[slot] ?? []
            return (
              <div key={slot} className="grid grid-cols-2 border-b border-[#111929] last:border-0">
                <div className="border-r border-[#111929]">
                  <p className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#5e7090]">{label}</p>
                  {home.length ? home.map((player) => <PlayerRow key={player.id} player={player} onEditSlot={() => onEdit(player)} />) : <p className="px-3 pb-3 text-xs text-[#5e7090]">Empty</p>}
                </div>
                <div>
                  <p className="px-3 py-2 text-right text-[10px] font-black uppercase tracking-wider text-[#5e7090]">{label}</p>
                  {away.length ? away.map((player) => <PlayerRow key={`${slot}-${player.name}`} player={{ ...player, id: `${slot}-${player.name}`, slot, gameTime: "Tonight" }} />) : <p className="px-3 pb-3 text-right text-xs text-[#5e7090]">Empty</p>}
                </div>
              </div>
            )
          })}
        </>
      )}
    </section>
  )
}

export function MatchupPanel({
  roster,
  teamName,
  playerNicknames,
  onMove,
  onSelectPlayer,
  onEditSlot,
  week,
  onWeekChange,
  selectedMatchupId: controlledMatchupId,
  onMatchupChange,
  onLiveSummary,
}: {
  roster: Player[]
  teamName: string
  playerNicknames: Record<string, string>
  onMove: (playerId: string, destSlot: Player["slot"]) => void
  onSelectPlayer?: (player: Player) => void
  onEditSlot?: (player: Player) => void
  week: number
  onWeekChange: (week: number) => void
  selectedMatchupId?: string
  onMatchupChange?: (matchupId: string) => void
  onLiveSummary?: (summary: MatchupSummary & { projectedHome: number; projectedAway: number }) => void
}) {
  const [localMatchupId, setLocalMatchupId] = useState(weekMatchups[0].id)
  const selectedMatchupId = controlledMatchupId ?? localMatchupId
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDialogTarget | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [liveRosters, setLiveRosters] = useState<{ home: Player[]; away: Player[] }>({ home: [], away: [] })
  const [currentLiveEvent, setCurrentLiveEvent] = useState("Waiting for live NHL events")
  const [currentLiveDelta, setCurrentLiveDelta] = useState("+0.0 FPTS")
  const setSelectedMatchupId = (id: string) => {
    if (controlledMatchupId === undefined) setLocalMatchupId(id)
    onMatchupChange?.(id)
  }
  useEffect(() => {
    if (controlledMatchupId && !weekMatchups.some((matchup) => matchup.id === controlledMatchupId)) {
      setLocalMatchupId(weekMatchups[0].id)
    }
  }, [controlledMatchupId])
  const matchupIndex = Math.max(0, weekMatchups.findIndex((matchup) => matchup.id === selectedMatchupId))
  const summary = weekMatchups[matchupIndex] ?? weekMatchups[0]
  const isUserMatchup = summary.homeOwner === "You" || summary.homeTeam === "Montreal Monarchs"
  const displaySummary = isUserMatchup ? { ...summary, homeTeam: teamName } : summary
  const sourceHomeRoster = getTeamRoster(summary.homeTeam, roster)
  const sourceAwayRoster = getTeamRoster(summary.awayTeam, roster)
  useEffect(() => {
    setLiveRosters({
      home: sourceHomeRoster.map((player) => ({ ...player, gameState: player.gameState ?? "In Progress", timeRemaining: player.timeRemaining ?? 40 })),
      away: sourceAwayRoster.map((player) => ({ ...player, gameState: player.gameState ?? "In Progress", timeRemaining: player.timeRemaining ?? 40 })),
    })
    setCurrentLiveEvent("P2 14:22 • Live scoring feed connected")
    setCurrentLiveDelta("+0.0 FPTS")
  }, [selectedMatchupId, roster])
  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveRosters((current) => {
        const candidates = [
          ...current.home.map((player) => ({ player, side: "home" as const })),
          ...current.away.map((player) => ({ player, side: "away" as const })),
        ].filter(({ player }) => player.slot !== "BN" && player.slot !== "TAXI" && player.slot !== "IR" && player.gameState === "In Progress" && player.status !== "O" && player.status !== "IR")
        if (!candidates.length) return current
        const selected = candidates[Math.floor(Math.random() * candidates.length)]
        const events = [
          { label: "shot on goal", delta: 0.5 },
          { label: "hit", delta: 0.25 },
          { label: "goal (PP)", delta: 3 },
        ]
        const event = events[Math.floor(Math.random() * events.length)]
        setCurrentLiveEvent(`P2 ${String(14 + Math.floor(Math.random() * 6)).padStart(2, "0")}:22 • ${selected.player.name.split(" ").map((part) => part[0]).join(". ")}. ${event.label} ${selected.player.opponent}`)
        setCurrentLiveDelta(`+${event.delta.toFixed(2)} FPTS`)
        const update = (players: Player[]) => players.map((player) => player.id === selected.player.id
          ? { ...player, todayPts: (player.todayPts ?? 0) + event.delta, timeRemaining: Math.max(0, (player.timeRemaining ?? 40) - 1) }
          : player)
        return selected.side === "home" ? { home: update(current.home), away: current.away } : { home: current.home, away: update(current.away) }
      })
    }, 3000)
    return () => window.clearInterval(interval)
  }, [selectedMatchupId])
  const homeRoster = liveRosters.home.length ? liveRosters.home : sourceHomeRoster
  const awayRoster = liveRosters.away.length ? liveRosters.away : sourceAwayRoster
  const rows = slotGroups.flatMap((slot) => {
    const homePlayers = homeRoster.filter((player) => player.slot === slot)
    const awayPlayers = awayRoster.filter((player) => player.slot === slot)
    return Array.from({ length: slotCapacities[slot] }, (_, index) => {
      return {
        slot,
        home: homePlayers[index] ? { ...homePlayers[index] } satisfies MatchupPlayer : emptyPlayer(slot),
        away: awayPlayers[index] ? { ...awayPlayers[index] } satisfies MatchupPlayer : emptyPlayer(slot),
      }
    })
  })
  const expectedTotal = (players: Player[]) => players.filter((player) => ["C", "W", "F", "D", "G"].includes(player.slot)).reduce((sum, player) => sum + (player.todayPts ?? 0) + player.projPts * ((player.timeRemaining ?? 0) / 60), 0)
  const projectedHome = expectedTotal(homeRoster)
  const projectedAway = expectedTotal(awayRoster)
  const isStarter = (player: Player) => ["C", "W", "F", "D", "G"].includes(player.slot)
  const homeGamesLeft = homeRoster.filter((player) => isStarter(player) && player.gameState !== "Final").length
  const awayGamesLeft = awayRoster.filter((player) => isStarter(player) && player.gameState !== "Final").length
  const liveSummary = {
    ...summary,
    homeScore: rows.reduce((sum, row) => sum + (row.home.todayPts ?? 0), 0),
    awayScore: rows.reduce((sum, row) => sum + (row.away.todayPts ?? 0), 0),
  }
  useEffect(() => {
    onLiveSummary?.({ ...liveSummary, projectedHome, projectedAway })
  }, [liveSummary.id, liveSummary.homeScore, liveSummary.awayScore, projectedHome, projectedAway, onLiveSummary])
  const selectMatchup = (index: number) => setSelectedMatchupId(weekMatchups[index].id)
  const previousMatchup = () => selectMatchup((matchupIndex === 0 ? weekMatchups.length : matchupIndex) - 1)
  const nextMatchup = () => selectMatchup((matchupIndex + 1) % weekMatchups.length)

  return (
    <div className="flex flex-col gap-3 pb-4">
      <MatchupBanner summary={{ ...liveSummary, homeTeam: displaySummary.homeTeam }} projectedHome={projectedHome} projectedAway={projectedAway} week={week} homeGamesLeft={homeGamesLeft} awayGamesLeft={awayGamesLeft} />
      <div className="flex items-center gap-2 overflow-x-auto px-3 pb-1" aria-label="League matchups">
        <button type="button" onClick={previousMatchup} aria-label="Previous matchup" className="shrink-0 text-[#5e7090]"><ChevronLeft className="size-4" /></button>
        {weekMatchups.map((matchup, index) => (
          <button key={matchup.id} type="button" onClick={() => selectMatchup(index)} aria-label={`Matchup ${index + 1}: ${matchup.homeTeam} vs ${matchup.awayTeam}`} className={cn("flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black", matchup.id === selectedMatchupId ? "border-[#19ffff] bg-[#19ffff]/10 text-[#19ffff]" : "border-[#172338] bg-[#0d1424] text-[#5e7090]")}>
            <span className="flex size-4 items-center justify-center rounded-full bg-[#172338] text-[8px]">{matchup.homeTeam.slice(0, 1)}</span>
            <span>vs</span>
            <span className="flex size-4 items-center justify-center rounded-full bg-[#3b1824] text-[8px]">{matchup.awayTeam.slice(0, 1)}</span>
          </button>
        ))}
        <button type="button" onClick={nextMatchup} aria-label="Next matchup" className="shrink-0 text-[#5e7090]"><ChevronRight className="size-4" /></button>
      </div>
      <LiveTicker event={currentLiveEvent} delta={currentLiveDelta} homeRoster={homeRoster} awayRoster={awayRoster} />
      <section className="overflow-hidden border-y border-[#111929] bg-[#080c14]">
            <div className="flex items-center justify-between border-b border-[#111929] px-3 py-3">
              <h2 className="text-sm font-black text-white">Starters ({rows.filter((row) => !row.home.empty).length}) <ChevronDown className="inline size-3.5 text-[#5e7090]" /></h2>
              <div className="flex items-center gap-1 text-xs font-bold text-[#19ffff]">
                <button type="button" onClick={() => onWeekChange(Math.max(1, week - 1))} aria-label="Previous scoring week" className="rounded p-1 hover:bg-[#172338]">
                  <ChevronLeft className="size-3.5" />
                </button>
                <span>Week {week}</span>
                <button type="button" onClick={() => onWeekChange(week + 1)} aria-label="Next scoring week" className="rounded p-1 hover:bg-[#172338]">
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-[#111929] px-3 py-2 text-[10px] font-bold text-[#5e7090]"><span>{displaySummary.homeTeam}</span><span>{displaySummary.awayTeam}</span></div>
            {rows.map((row, index) => (
              <div key={`${row.slot}-${index}`} className="grid grid-cols-[minmax(0,1fr)_38px_34px_38px_minmax(0,1fr)] items-center gap-1 border-b border-[#111929] bg-[#0d1424] px-2 py-2 last:border-0 hover:bg-[#101a2e]">
                <div className="min-w-0">
                  <PlayerSide player={row.home} align="left" onSelect={(player) => {
                    const selected = homeRoster.find((candidate) => candidate.name === player.name)
                    if (selected && onSelectPlayer) onSelectPlayer(selected)
                    else setSelectedPlayer(toDialogPlayer(player))
                  }} nickname={homeRoster.find((candidate) => candidate.name === row.home.name)?.id ? playerNicknames[homeRoster.find((candidate) => candidate.name === row.home.name)?.id ?? ""] : undefined} />
                  {!row.home.empty && <PlayerStats player={row.home} align="left" />}
                </div>
                <Score player={row.home} align="left" />
                <button type="button" disabled={row.home.empty || !isUserMatchup} onClick={() => {
                  const player = homeRoster.find((candidate) => candidate.name === row.home.name)
                  if (!player) return
                  if (!isUserMatchup) return
                  if (onEditSlot) onEditSlot(player)
                  else setEditingPlayer(player)
                }} className={cn("flex size-7 items-center justify-center rounded-md text-[10px] font-black text-white", slotColors[row.slot], (row.home.empty || !isUserMatchup) && "cursor-default opacity-40")}>{row.slot}</button>
                <Score player={row.away} align="right" />
                <div className="min-w-0">
                  <PlayerSide player={row.away} align="right" onSelect={(player) => setSelectedPlayer(toDialogPlayer(player))} />
                  {!row.away.empty && <PlayerStats player={row.away} align="right" />}
                </div>
              </div>
            ))}
          </section>
          <Reserves roster={homeRoster} opponent={opponentReserves[summary.id] ?? { BN: [], TAXI: [], IR: [] }} teamName={displaySummary.homeTeam} opponentName={displaySummary.awayTeam} onEdit={isUserMatchup ? setEditingPlayer : () => undefined} />

      <PlayerDetailDialog player={selectedPlayer} open={selectedPlayer !== null} onOpenChange={(open) => !open && setSelectedPlayer(null)} />
      <LineupSlotDialog player={editingPlayer} roster={roster} open={editingPlayer !== null} onOpenChange={(open) => !open && setEditingPlayer(null)} onMove={(playerId, destSlot) => { onMove(playerId, destSlot); setEditingPlayer(null) }} />
    </div>
  )
}
