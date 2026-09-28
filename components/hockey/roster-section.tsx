"use client"

import { useState } from "react"
import { PlayerRow } from "@/components/hockey/player-row"
import { LineupSlotDialog } from "@/components/hockey/lineup-slot-dialog"
import { Badge } from "@/components/ui/badge"
import { draftPicks, roster as initialRoster, type Player } from "@/lib/hockey-data"

const startingOrder: Array<{ slot: Player["position"]; label: string; capacity: number }> = [
  { slot: "C", label: "Center", capacity: 1 },
  { slot: "LW", label: "Left Wing", capacity: 1 },
  { slot: "RW", label: "Right Wing", capacity: 1 },
  { slot: "D", label: "Defense", capacity: 2 },
  { slot: "G", label: "Goalie", capacity: 1 },
]

export function RosterSection() {
  const [rosterState, setRosterState] = useState<Player[]>(initialRoster)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  const starters = rosterState.filter((p) => startingOrder.some((s) => s.slot === p.slot))
  const bench = rosterState.filter((p) => p.slot === "BN")
  const taxi = rosterState.filter((p) => p.slot === "TAXI")
  const ir = rosterState.filter((p) => p.slot === "IR")

  function handleMove(playerId: string, destSlot: Player["slot"]) {
    setRosterState((prev) => {
      const target = prev.find((p) => p.id === playerId)
      if (!target) return prev

      let next = prev

      // If moving into a starting slot that's already at capacity, bench the
      // longest-standing starter in that slot to make room.
      const startingSlotInfo = startingOrder.find((s) => s.slot === destSlot)
      if (startingSlotInfo) {
        const currentOccupants = prev.filter((p) => p.slot === destSlot && p.id !== playerId)
        if (currentOccupants.length >= startingSlotInfo.capacity) {
          const bumpedId = currentOccupants[0].id
          next = next.map((p) => (p.id === bumpedId ? { ...p, slot: "BN" } : p))
        }
      }

      return next.map((p) => (p.id === playerId ? { ...p, slot: destSlot } : p))
    })
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Starting Lineup</h2>
          <p className="text-[11px] text-zinc-500">Tap a position badge to move a player</p>
        </div>
        <div>
          {starters.map((player) => (
            <PlayerRow key={player.id} player={player} onEditSlot={() => setEditingPlayer(player)} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Bench</h2>
        </div>
        <div>
          {bench.map((player) => (
            <PlayerRow key={player.id} player={player} onEditSlot={() => setEditingPlayer(player)} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Taxi Squad</h2>
          <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
            Under 80 NHL Games Played
          </span>
        </div>
        <div>
          {taxi.map((player) => (
            <PlayerRow key={player.id} player={player} onEditSlot={() => setEditingPlayer(player)} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Injured Reserve</h2>
        </div>
        <div>
          {ir.map((player) => (
            <PlayerRow key={player.id} player={player} onEditSlot={() => setEditingPlayer(player)} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Future Draft Picks</h2>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {draftPicks.map((pick) => (
            <Badge key={pick} variant="secondary" className="bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/10">
              {pick}
            </Badge>
          ))}
        </div>
      </section>

      <LineupSlotDialog
        player={editingPlayer}
        open={editingPlayer !== null}
        onOpenChange={(open) => {
          if (!open) setEditingPlayer(null)
        }}
        onMove={handleMove}
      />
    </div>
  )
}
