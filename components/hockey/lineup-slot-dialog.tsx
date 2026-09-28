"use client"

import { CheckIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Player } from "@/lib/hockey-data"

const positionLabels: Record<Player["position"], string> = {
  C: "Center",
  LW: "Left Wing",
  RW: "Right Wing",
  D: "Defense",
  G: "Goalie",
}

interface SlotOption {
  slot: Player["slot"]
  label: string
  description: string
}

function getDestinationOptions(player: Player): SlotOption[] {
  return [
    {
      slot: player.position,
      label: `${positionLabels[player.position]} (Starting)`,
      description: "Active lineup · counts toward this week's score",
    },
    {
      slot: "BN",
      label: "Bench",
      description: "Roster spot · does not score",
    },
    {
      slot: "TAXI",
      label: "Taxi Squad",
      description: "Eligible players under 80 NHL games played",
    },
    {
      slot: "IR",
      label: "Injured Reserve",
      description: "For players currently marked out or day-to-day",
    },
  ]
}

export function LineupSlotDialog({
  player,
  open,
  onOpenChange,
  onMove,
}: {
  player: Player | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMove: (playerId: string, destSlot: Player["slot"]) => void
}) {
  if (!player) return null

  const options = getDestinationOptions(player)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-zinc-800 bg-zinc-900 p-0 text-white">
        <DialogHeader className="border-b border-zinc-800 px-5 py-4">
          <DialogTitle className="text-base font-semibold text-white">Move {player.name}</DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Choose where to place this player. Moving into a full starting slot will bench the current starter.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 p-4">
          {options.map((option) => {
            const isCurrent = option.slot === player.slot
            return (
              <button
                key={option.slot}
                type="button"
                disabled={isCurrent}
                onClick={() => {
                  onMove(player.id, option.slot)
                  onOpenChange(false)
                }}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  isCurrent
                    ? "cursor-default border-cyan-400/40 bg-cyan-400/10"
                    : "border-zinc-800 bg-zinc-800/40 hover:border-zinc-700 hover:bg-zinc-800",
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{option.label}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{option.description}</p>
                </div>
                {isCurrent && <CheckIcon data-icon="inline-end" className="shrink-0 text-cyan-400" />}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
