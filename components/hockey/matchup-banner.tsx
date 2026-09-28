import { Progress } from "@/components/ui/progress"
import type { MatchupSummary } from "@/lib/hockey-data"

export function MatchupBanner({ summary }: { summary: MatchupSummary }) {
  const progressPct =
    summary.totalMinutes === 0
      ? 100
      : Math.round(((summary.totalMinutes - summary.minutesRemaining) / summary.totalMinutes) * 100)
  const homeWinning = summary.homeScore >= summary.awayScore
  const isFinal = summary.status === "Final"

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">Week {8}</span>
        <span
          className={
            isFinal
              ? "rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-400"
              : "flex items-center gap-1.5 rounded-full bg-lime-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-lime-400"
          }
        >
          {!isFinal && <span className="size-1.5 animate-pulse rounded-full bg-lime-400" aria-hidden="true" />}
          {summary.status}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-semibold ${homeWinning ? "text-white" : "text-zinc-400"}`}>
            {summary.homeTeam}
          </p>
          <p className="truncate text-[11px] text-zinc-500">
            {summary.homeOwner} · {summary.homeRecord}
          </p>
          <p className={`text-2xl font-bold tabular-nums ${homeWinning ? "text-cyan-400" : "text-zinc-300"}`}>
            {summary.homeScore.toFixed(1)}
          </p>
        </div>
        <span className="shrink-0 text-sm font-medium text-zinc-500">vs</span>
        <div className="min-w-0 flex-1 text-right">
          <p className={`truncate text-sm font-semibold ${!homeWinning ? "text-white" : "text-zinc-400"}`}>
            {summary.awayTeam}
          </p>
          <p className="truncate text-[11px] text-zinc-500">
            {summary.awayOwner} · {summary.awayRecord}
          </p>
          <p className={`text-2xl font-bold tabular-nums ${!homeWinning ? "text-cyan-400" : "text-zinc-300"}`}>
            {summary.awayScore.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Progress value={progressPct} className="h-1.5 bg-zinc-800 [&>div]:bg-cyan-400" />
        <p className="mt-1.5 text-[11px] text-zinc-500">
          {isFinal ? "Final" : `${summary.minutesRemaining} min remaining`}
        </p>
      </div>
    </div>
  )
}
