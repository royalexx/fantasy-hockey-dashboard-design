"use client"

import { cn } from "@/lib/utils"

export type TeamTab = "roster" | "matchup" | "taxi" | "league"

const tabs: Array<{ id: TeamTab; label: string }> = [
  { id: "roster", label: "Roster" },
  { id: "matchup", label: "Matchup" },
  { id: "taxi", label: "Taxi / Picks" },
  { id: "league", label: "League" },
]

export function TabNav({ active, onChange }: { active: TeamTab; onChange: (tab: TeamTab) => void }) {
  return (
    <div className="mx-4 mt-4 flex gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? "true" : undefined}
          className={cn(
            "flex-1 rounded-xl px-2 py-2 text-xs font-semibold transition-colors",
            active === tab.id ? "bg-cyan-400 text-zinc-950" : "text-zinc-400 hover:text-white",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
