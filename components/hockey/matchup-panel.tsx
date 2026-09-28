import { matchup, matchupTopScorers } from "@/lib/hockey-data"

export function MatchupPanel() {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2.5">
          <h2 className="truncate text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {matchup.homeTeam}
          </h2>
        </div>
        <div>
          {matchupTopScorers.home.map((s) => (
            <div key={s.name} className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-2.5 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-white">{s.name}</p>
                <p className="text-xs text-zinc-500">{s.team}</p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-lime-400">{s.pts.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-4 py-2.5">
          <h2 className="truncate text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {matchup.awayTeam}
          </h2>
        </div>
        <div>
          {matchupTopScorers.away.map((s) => (
            <div key={s.name} className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-2.5 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-white">{s.name}</p>
                <p className="text-xs text-zinc-500">{s.team}</p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-lime-400">{s.pts.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
