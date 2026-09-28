"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getPlayerDetail, type Player, type PlayerStatus } from "@/lib/hockey-data"

const positionColors: Record<Player["position"], string> = {
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

export interface PlayerDialogTarget {
  name: string
  position: Player["position"]
  team: string
  opponent: string
  status: PlayerStatus
  todayPts: number | null
  projPts: number
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "log", label: "Game Log" },
  { id: "seasons", label: "Seasons" },
  { id: "depth", label: "Depth Chart" },
  { id: "moves", label: "Transactions" },
] as const

type TabId = (typeof TABS)[number]["id"]

export function PlayerDetailDialog({
  player,
  open,
  onOpenChange,
}: {
  player: PlayerDialogTarget | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [tab, setTab] = useState<TabId>("overview")
  const detail = useMemo(() => (player ? getPlayerDetail(player) : null), [player])

  if (!player || !detail) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setTab("overview")
      }}
    >
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 sm:max-w-lg" showCloseButton>
        <DialogHeader className="gap-0 border-b border-zinc-800 bg-zinc-900 p-4">
          <DialogTitle className="sr-only">{player.name} player details</DialogTitle>
          <DialogDescription className="sr-only">
            Fantasy stats, game log, past seasons, depth chart, and transaction history for {player.name}.
          </DialogDescription>
          <div className="flex items-center gap-3 pr-8">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
              <Image
                src="/players/player-generic.png"
                alt={`${player.name} headshot`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-base font-semibold text-white">{player.name}</h2>
                {player.status && (
                  <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold", statusStyles[player.status])}>
                    {player.status}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge className={cn("h-5 rounded px-1.5 text-[10px] font-bold", positionColors[player.position])}>
                  {player.position}
                </Badge>
                <p className="truncate text-xs text-zinc-400">
                  {player.team} · {player.opponent}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-bold tabular-nums text-lime-400">
                {player.todayPts != null ? player.todayPts.toFixed(1) : "—"}
              </p>
              <p className="text-[11px] tabular-nums text-zinc-500">proj {player.projPts.toFixed(1)}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-800 bg-zinc-950 px-2 py-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                tab === t.id ? "bg-cyan-400/15 text-cyan-400" : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-4">
            {tab === "overview" && <OverviewTab detail={detail} />}
            {tab === "log" && <GameLogTab detail={detail} isGoalie={player.position === "G"} />}
            {tab === "seasons" && <SeasonsTab detail={detail} />}
            {tab === "depth" && <DepthChartTab detail={detail} team={player.team} />}
            {tab === "moves" && <TransactionsTab detail={detail} />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-center">
      <p className="text-base font-bold tabular-nums text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</p>
    </div>
  )
}

function OverviewTab({ detail }: { detail: ReturnType<typeof getPlayerDetail> }) {
  const { bio, seasonTotals } = detail
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">2025-26 Fantasy Stats</h3>
        <div className="grid grid-cols-3 gap-2">
          <StatBlock label="Fpts" value={seasonTotals.fpts} />
          <StatBlock label="Fpts/GP" value={seasonTotals.fptsPerGame} />
          <StatBlock label="Points" value={seasonTotals.pts} />
          <StatBlock label="Goals" value={seasonTotals.g} />
          <StatBlock label="Assists" value={seasonTotals.a} />
          <StatBlock label="SOG" value={seasonTotals.sog} />
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Bio</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <BioRow label="Age" value={String(bio.age)} />
          <BioRow label="Ht / Wt" value={bio.heightWeight} />
          <BioRow label="Birthplace" value={bio.birthplace} />
          <BioRow label="Shoots" value={bio.shoots} />
          <BioRow label="Drafted" value={bio.draft} className="col-span-2" />
        </div>
      </div>
    </div>
  )
}

function BioRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2", className)}>
      <p className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="truncate text-sm font-medium text-white">{value}</p>
    </div>
  )
}

function GameLogTab({ detail, isGoalie }: { detail: ReturnType<typeof getPlayerDetail>; isGoalie: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-500">
            <th className="px-2 py-2 text-left font-medium">Date</th>
            <th className="px-2 py-2 text-left font-medium">Opp</th>
            <th className="px-2 py-2 text-left font-medium">Result</th>
            {!isGoalie && <th className="px-2 py-2 text-right font-medium">G</th>}
            {!isGoalie && <th className="px-2 py-2 text-right font-medium">A</th>}
            {!isGoalie && <th className="px-2 py-2 text-right font-medium">SOG</th>}
            <th className="px-2 py-2 text-right font-medium">TOI</th>
            <th className="px-2 py-2 text-right font-medium">Fpts</th>
          </tr>
        </thead>
        <tbody>
          {detail.gameLog.map((g, i) => (
            <tr key={i} className="border-b border-zinc-800/70 last:border-b-0">
              <td className="px-2 py-2 text-zinc-400">{g.date}</td>
              <td className="px-2 py-2 text-zinc-300">{g.opp}</td>
              <td className={cn("px-2 py-2 font-medium", g.result.startsWith("W") ? "text-emerald-400" : "text-red-400")}>
                {g.result}
              </td>
              {!isGoalie && <td className="px-2 py-2 text-right tabular-nums text-zinc-300">{g.g}</td>}
              {!isGoalie && <td className="px-2 py-2 text-right tabular-nums text-zinc-300">{g.a}</td>}
              {!isGoalie && <td className="px-2 py-2 text-right tabular-nums text-zinc-300">{g.sog}</td>}
              <td className="px-2 py-2 text-right tabular-nums text-zinc-400">{g.toi}</td>
              <td className="px-2 py-2 text-right tabular-nums font-semibold text-lime-400">{g.fpts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SeasonsTab({ detail }: { detail: ReturnType<typeof getPlayerDetail> }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-500">
            <th className="px-2 py-2 text-left font-medium">Season</th>
            <th className="px-2 py-2 text-left font-medium">Team</th>
            <th className="px-2 py-2 text-right font-medium">GP</th>
            <th className="px-2 py-2 text-right font-medium">G</th>
            <th className="px-2 py-2 text-right font-medium">A</th>
            <th className="px-2 py-2 text-right font-medium">PTS</th>
            <th className="px-2 py-2 text-right font-medium">Fpts/GP</th>
          </tr>
        </thead>
        <tbody>
          {detail.pastSeasons.map((s) => (
            <tr key={s.season} className="border-b border-zinc-800/70 last:border-b-0">
              <td className="px-2 py-2 font-medium text-white">{s.season}</td>
              <td className="px-2 py-2 text-zinc-400">{s.team}</td>
              <td className="px-2 py-2 text-right tabular-nums text-zinc-300">{s.gp}</td>
              <td className="px-2 py-2 text-right tabular-nums text-zinc-300">{s.g}</td>
              <td className="px-2 py-2 text-right tabular-nums text-zinc-300">{s.a}</td>
              <td className="px-2 py-2 text-right tabular-nums text-zinc-300">{s.pts}</td>
              <td className="px-2 py-2 text-right tabular-nums font-semibold text-lime-400">{s.fptsPerGame}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const GRID_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
}

function DepthChartTab({ detail, team }: { detail: ReturnType<typeof getPlayerDetail>; team: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-zinc-500">Projected {team} starting lineup</p>
      {detail.depthChart.map((line) => (
        <div key={line.line} className="overflow-hidden rounded-xl border border-zinc-800">
          <div className="border-b border-zinc-800 bg-zinc-950 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            {line.line}
          </div>
          <div className={cn("grid divide-x divide-zinc-800", GRID_COLS[line.slots.length] ?? "grid-cols-3")}>
            {line.slots.map((slot) => (
              <div
                key={slot.label}
                className={cn("px-3 py-2.5 text-center", slot.isTarget && "bg-cyan-400/10")}
              >
                <p className="text-[10px] font-bold text-zinc-500">{slot.label}</p>
                <p className={cn("truncate text-sm font-medium", slot.isTarget ? "text-cyan-400" : "text-white")}>
                  {slot.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TransactionsTab({ detail }: { detail: ReturnType<typeof getPlayerDetail> }) {
  return (
    <div className="flex flex-col gap-2">
      {detail.transactions.map((tx, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5">
          <Badge variant="outline" className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px]">
            {tx.type}
          </Badge>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-zinc-200">{tx.description}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">{tx.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
