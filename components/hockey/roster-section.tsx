import { PlayerRow } from "@/components/hockey/player-row"
import { roster } from "@/lib/hockey-data"

const startingOrder: Array<{ slot: string; label: string }> = [
  { slot: "C", label: "Center" },
  { slot: "LW", label: "Left Wing" },
  { slot: "RW", label: "Right Wing" },
  { slot: "D", label: "Defense" },
  { slot: "G", label: "Goalie" },
]

export function RosterSection() {
  const starters = roster.filter((p) => startingOrder.some((s) => s.slot === p.slot))
  const bench = roster.filter((p) => p.slot === "BN")

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Starting Lineup</h2>
        </div>
        <div>
          {starters.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Bench</h2>
        </div>
        <div>
          {bench.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </div>
      </section>
    </div>
  )
}
