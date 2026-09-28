import { PlayerRow } from "@/components/hockey/player-row"
import { Badge } from "@/components/ui/badge"
import { draftPicks, roster } from "@/lib/hockey-data"

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
  const taxi = roster.filter((p) => p.slot === "TAXI")
  const ir = roster.filter((p) => p.slot === "IR")

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

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Taxi Squad</h2>
          <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
            Under 80 NHL Games Played
          </span>
        </div>
        <div>
          {taxi.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Injured Reserve</h2>
        </div>
        <div>
          {ir.map((player) => (
            <PlayerRow key={player.id} player={player} />
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
    </div>
  )
}
