import { cn } from "@/lib/utils"
import { standings } from "@/lib/hockey-data"

export function LeaguePanel() {
  return (
    <div className="px-4 pb-4">
      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Standings</h2>
        </div>
        <div>
          {standings.map((row) => (
            <div
              key={row.team}
              className="flex items-center gap-3 border-b border-zinc-800/70 px-4 py-3 last:border-b-0"
            >
              <span className="w-5 shrink-0 text-sm font-bold text-zinc-500">{row.rank}</span>
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm font-medium", row.owner === "You" ? "text-cyan-400" : "text-white")}>
                  {row.team}
                </p>
                <p className="truncate text-xs text-zinc-500">{row.owner}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold tabular-nums text-white">
                  {row.wins}-{row.losses}
                </p>
                <p className="text-[11px] tabular-nums text-zinc-500">{row.pointsFor.toFixed(1)} pf</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
