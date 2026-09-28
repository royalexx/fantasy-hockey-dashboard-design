"use client"

import { useState } from "react"
import { ArrowLeftRight, Swords, Users } from "lucide-react"
import { AppHeader } from "@/components/hockey/app-header"
import { MatchupBanner } from "@/components/hockey/matchup-banner"
import { TabNav, type TeamTab } from "@/components/hockey/tab-nav"
import { RosterSection } from "@/components/hockey/roster-section"
import { MatchupPanel } from "@/components/hockey/matchup-panel"
import { LeaguePanel } from "@/components/hockey/league-panel"
import { LeagueChatDrawer } from "@/components/hockey/league-chat-drawer"
import { BottomNav, type BottomNavItem } from "@/components/hockey/bottom-nav"
import { PlaceholderPanel } from "@/components/hockey/placeholder-panel"

export default function Page() {
  const [teamTab, setTeamTab] = useState<TeamTab>("roster")
  const [bottomNav, setBottomNav] = useState<BottomNavItem>("team")
  const [chatOpen, setChatOpen] = useState(false)

  function handleBottomNavChange(item: BottomNavItem) {
    if (item === "chat") {
      setChatOpen(true)
      return
    }
    setBottomNav(item)
  }

  return (
    <main className="min-h-screen bg-zinc-950 pb-24">
      <AppHeader />
      <MatchupBanner />

      {bottomNav === "team" && (
        <>
          <TabNav active={teamTab} onChange={setTeamTab} />
          <div className="mt-4">
            {teamTab === "roster" && <RosterSection />}
            {teamTab === "matchup" && <MatchupPanel />}
            {teamTab === "league" && <LeaguePanel />}
          </div>
        </>
      )}

      {bottomNav === "matchups" && (
        <PlaceholderPanel
          icon={Swords}
          title="All Matchups"
          description="Full league matchup schedule for Week 8 is coming soon."
        />
      )}

      {bottomNav === "draft" && (
        <PlaceholderPanel
          icon={Users}
          title="Draft Room"
          description="The next dynasty draft board will appear here."
        />
      )}

      {bottomNav === "trades" && (
        <PlaceholderPanel
          icon={ArrowLeftRight}
          title="Trade Center"
          description="Active and past trade offers will show up here."
        />
      )}

      <LeagueChatDrawer open={chatOpen} onOpenChange={setChatOpen} />
      <BottomNav active={bottomNav} onChange={handleBottomNavChange} />
    </main>
  )
}
