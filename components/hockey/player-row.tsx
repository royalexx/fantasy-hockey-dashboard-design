"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Player } from "@/lib/hockey-data"
import { PlayerDetailDialog } from "@/components/hockey/player-detail-dialog"

const positionColors: Record<Player["position"], string> = {
  C: "text-cyan-400",
  LW: "text-emerald-400",
  RW: "text-violet-400",
  D: "text-orange-400",
  G: "text-sky-400",
}

const statusStyles: Record<string, string> = {
  IR: "bg-red-400/10 text-red-400",
  TAXI: "bg-amber-400/10 text-amber-400",
  O: "bg-red-500/10 text-red-500",
  DTD: "bg-yellow-400/10 text-yellow-400",
}

export function PlayerRow({ player, onEditSlot }: { player: Player; onEditSlot?: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex w-full items-center gap-3 border-b border-zinc-800/70 px-4 py-3 last:border-b-0 hover:bg-zinc-800/40">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onEditSlot?.()
          }}
          title="Edit lineup slot"
          className={cn(
            "w-6 shrink-0 rounded text-xs font-bold transition-colors",
            positionColors[player.position],
            onEditSlot && "cursor-pointer underline decoration-dotted decoration-1 underline-offset-2 hover:opacity-80",
          )}
        >
          {player.slot}
        </button>

        <button type="button" onClick={() => setOpen(true)} className="flex flex-1 items-center gap-3 text-left">
          <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
            <Image
              src="/players/player-generic.png"
              alt={`${player.name} headshot`}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-medium text-white">{player.name}</p>
              {player.status && (
                <span
                  className={cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold", statusStyles[player.status])}
                >
                  {player.status}
                </span>
              )}
            </div>
            <p className="truncate text-xs text-zinc-500">
              {player.team} · {player.opponent} · {player.gameTime}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold tabular-nums text-lime-400">
              {player.todayPts != null ? player.todayPts.toFixed(1) : "—"}
            </p>
            <p className="text-[11px] tabular-nums text-zinc-500">proj {player.projPts.toFixed(1)}</p>
          </div>
        </button>
      </div>

      <PlayerDetailDialog
        player={{
          name: player.name,
          position: player.position,
          team: player.team,
          opponent: player.opponent,
          status: player.status,
          todayPts: player.todayPts,
          projPts: player.projPts,
        }}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
