"use client"

import { ArrowLeftRight, MessageSquare, Shield, Swords, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export type BottomNavItem = "team" | "matchups" | "draft" | "trades" | "chat"

const items: Array<{ id: BottomNavItem; label: string; icon: typeof Users }> = [
  { id: "team", label: "Team", icon: Shield },
  { id: "matchups", label: "Matchups", icon: Swords },
  { id: "draft", label: "Draft", icon: Users },
  { id: "trades", label: "Trades", icon: ArrowLeftRight },
  { id: "chat", label: "Chat", icon: MessageSquare },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: BottomNavItem
  onChange: (item: BottomNavItem) => void
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-current={isActive ? "true" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-1"
            >
              <Icon className={cn("size-5", isActive ? "text-cyan-400" : "text-zinc-500")} aria-hidden="true" />
              <span className={cn("text-[11px] font-medium", isActive ? "text-cyan-400" : "text-zinc-500")}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
