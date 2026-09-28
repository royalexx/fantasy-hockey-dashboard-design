import { Progress } from "@/components/ui/progress"
import { league, matchup } from "@/lib/hockey-data"

export function MatchupBanner() {
  const progressPct = Math.round(
    ((matchup.totalMinutes - matchup.minutesRemaining) / matchup.totalMinutes) * 100,
  )
  const homeWinning = matchup.homeScore >= matchup.awayScore

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">Week {league.week}</span>
        <span className="flex items-center gap-1.5 rounded-full bg-lime-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-lime-400">
          <span className="size-1.5 animate-pulse rounded-full bg-lime-400" aria-hidden="true" />
          {matchup.status}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-semibold ${homeWinning ? "text-white" : "text-zinc-400"}`}>
            {matchup.homeTeam}
          </p>
          <p className={`text-2xl font-bold tabular-nums ${homeWinning ? "text-cyan-400" : "text-zinc-300"}`}>
            {matchup.homeScore.toFixed(1)}
          </p>
        </div>
        <span className="shrink-0 text-sm font-medium text-zinc-500">vs</span>
        <div className="min-w-0 flex-1 text-right">
          <p className={`truncate text-sm font-semibold ${!homeWinning ? "text-white" : "text-zinc-400"}`}>
            {matchup.awayTeam}
          </p>
          <p className={`text-2xl font-bold tabular-nums ${!homeWinning ? "text-cyan-400" : "text-zinc-300"}`}>
            {matchup.awayScore.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Progress value={progressPct} className="h-1.5 bg-zinc-800 [&>div]:bg-cyan-400" />
        <p className="mt-1.5 text-[11px] text-zinc-500">{matchup.minutesRemaining} min remaining</p>
      </div>
    </div>
  )
}
