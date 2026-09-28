"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { league, matchup, matchupStarters, type MatchupPlayer, type MatchupRow } from "@/lib/hockey-data"

const positionColors: Record<MatchupRow["slot"], string> = {
  C: "bg-cyan-400/15 text-cyan-400",
  LW: "bg-emerald-400/15 text-emerald-400",
  RW: "bg-violet-400/15 text-violet-400",
  D: "bg-orange-400/15 text-orange-400",
  G: "bg-sky-400/15 text-sky-400",
}

const statusStyles: Record<string, string> = {
  IR: "bg-red-400/10 text-red-400",
  TAXI: "bg-amber-400/10 text-amber-400",
  O: "bg-red-500/10 text-red-500",
  DTD: "bg-yellow-400/10 text-yellow-400",
}

function PlayerSide({ player, align }: { player: MatchupPlayer; align: "left" | "right" }) {
  return (
    <div className={cn("min-w-0", align === "left" ? "text-right" : "text-left")}>
      <div className={cn("flex items-center gap-1.5", align === "left" ? "justify-end" : "justify-start")}>
        {align === "left" && player.status && (
          <span className={cn("shrink-0 rounded px-1 py-0.5 text-[9px] font-bold", statusStyles[player.status])}>
            {player.status}
          </span>
        )}
        <p className="truncate text-sm font-semibold text-white">{player.name}</p>
        {align === "right" && player.status && (
          <span className={cn("shrink-0 rounded px-1 py-0.5 text-[9px] font-bold", statusStyles[player.status])}>
            {player.status}
          </span>
        )}
      </div>
      <p className="truncate text-[11px] text-zinc-500">
        {player.position} · {player.team} ({player.opponent})
      </p>
    </div>
  )
}

function PlayerPts({ player, align }: { player: MatchupPlayer; align: "left" | "right" }) {
  return (
    <div className={align === "left" ? "text-right" : "text-left"}>
      <p className="text-sm font-semibold tabular-nums text-lime-400">
        {player.todayPts != null ? player.todayPts.toFixed(2) : "—"}
      </p>
      <p className="text-[10px] tabular-nums text-zinc-500">{player.projPts.toFixed(2)}</p>
    </div>
  )
}

export function MatchupPanel() {
  const [week, setWeek] = useState(league.week)
  const homeWinning = matchup.homeScore >= matchup.awayScore

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Starters</h2>
            <p className="text-[11px] text-zinc-500">Side-by-side lineup comparison</p>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 px-1 py-1">
            <button
              type="button"
              onClick={() => setWeek((w) => Math.max(1, w - 1))}
              aria-label="Previous week"
              className="rounded-full p-1 text-zinc-400 hover:text-cyan-400"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-1 text-xs font-semibold text-cyan-400">Week {week}</span>
            <button
              type="button"
              onClick={() => setWeek((w) => w + 1)}
              aria-label="Next week"
              className="rounded-full p-1 text-zinc-400 hover:text-cyan-400"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <p className={cn("truncate text-xs font-semibold", homeWinning ? "text-white" : "text-zinc-500")}>
            {matchup.homeTeam}
          </p>
          <p className={cn("truncate text-xs font-semibold", !homeWinning ? "text-white" : "text-zinc-500")}>
            {matchup.awayTeam}
          </p>
        </div>

        <div>
          {matchupStarters.map((row, index) => (
            <div
              key={`${row.slot}-${index}`}
              className="grid grid-cols-[1fr_54px_40px_54px_1fr] items-center gap-1.5 border-b border-zinc-800/70 px-3 py-3 last:border-b-0 sm:gap-3"
            >
              <PlayerSide player={row.home} align="left" />
              <PlayerPts player={row.home} align="left" />
              <div className="flex justify-center">
                <span className={cn("rounded-lg px-2 py-1.5 text-[10px] font-bold", positionColors[row.slot])}>
                  {row.slot}
                </span>
              </div>
              <PlayerPts player={row.away} align="right" />
              <PlayerSide player={row.away} align="right" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
