"use client"

import { Bell, ChevronDown, Settings } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { league } from "@/lib/hockey-data"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur">
      <button className="flex min-w-0 items-center gap-1.5 text-left">
        <span className="truncate text-sm font-semibold text-white">{league.name}</span>
        <ChevronDown className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      <div className="flex shrink-0 items-center gap-3">
        <button className="relative text-zinc-400 transition-colors hover:text-white" aria-label="Notifications">
          <Bell className="size-5" aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-cyan-400" aria-hidden="true" />
        </button>
        <button className="text-zinc-400 transition-colors hover:text-white" aria-label="League settings">
          <Settings className="size-5" aria-hidden="true" />
        </button>
        <Avatar className="size-8 border border-zinc-700">
          <AvatarFallback className="bg-zinc-800 text-xs font-semibold text-cyan-400">MM</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
