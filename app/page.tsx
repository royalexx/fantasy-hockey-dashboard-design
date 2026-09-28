"use client"

import { useState } from "react"
import { AppHeader } from "@/components/hockey/app-header"
import { TabNav, type TeamTab } from "@/components/hockey/tab-nav"
import { RosterSection } from "@/components/hockey/roster-section"
import { MatchupPanel } from "@/components/hockey/matchup-panel"
import { LeaguePanel } from "@/components/hockey/league-panel"
import { LeagueChatDrawer } from "@/components/hockey/league-chat-drawer"

export default function Page() {
  const [teamTab, setTeamTab] = useState<TeamTab>("roster")
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <main className="min-h-screen bg-zinc-950 pb-16">
      <AppHeader />
      <TabNav active={teamTab} onChange={setTeamTab} />

      <div className="mt-4">
        {teamTab === "roster" && <RosterSection />}
        {teamTab === "matchup" && <MatchupPanel />}
        {teamTab === "league" && <LeaguePanel />}
      </div>

      <LeagueChatDrawer open={chatOpen} onOpenChange={setChatOpen} />
    </main>
  )
}
