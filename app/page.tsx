"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Search, 
  TrendingUp, 
  ArrowLeftRight, 
  Award, 
  MessageSquare, 
  Check, 
  Flame, 
  ChevronDown, 
  Zap,
  Calendar,
  Receipt,
  Newspaper,
  X,
  ChevronDown as   Grid2X2,
  List,
  Plus,
} from "lucide-react"

import { 
  roster as initialRoster, 
  marketPlayers, 
  standings, 
  draftPicks, 
  activities,
  weekMatchups,
  teamSchedule,
  playerNews,
  getTeamRoster,
  calculatePlayerFPTS,
  calculateSkaterFPTS,
  calculateGoalieFPTS,
  createPlayerSeasonStats,
  type SkaterStats,
  type GoalieStats,
  type Player,
  type MarketPlayer,
  type PlayerStatus,
  type WaiverClaim,
  defaultFaabBudget,
  league,
  type TradeBlockEntry,
  type LeagueTradeOffer,
  type MatchupSummary,
} from "@/lib/hockey-data"
import { MatchupPanel } from "@/components/hockey/matchup-panel"
import { PlayerDetailDialog, type PlayerDialogTarget } from "@/components/hockey/player-detail-dialog"
import { LineupSlotDialog } from "@/components/hockey/lineup-slot-dialog"
import { DirectMessagesDialog } from "@/components/hockey/direct-messages-dialog"
import { LeagueChatDrawer } from "@/components/hockey/league-chat-drawer"
import type { PlayerGridSettings } from "@/components/hockey/player-grid-dialog"
import { WaiverClaimDialog } from "@/components/hockey/waiver-claim-dialog"
import { TransactionsDrawer } from "@/components/hockey/transactions-drawer"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { TradeBuilderDialog, type TradeProposal, type TradeTeam } from "@/components/hockey/trade-builder-dialog"
import { LeagueFeed } from "@/components/hockey/league-feed"

type MainTab = "MATCH" | "TEAM" | "PLAYERS" | "LEAGUE"
type PositionFilter = "ALL" | "C" | "W" | "F" | "D" | "G"
type TrendingPlayer = { name: string; team: string; position: "C" | "LW" | "RW" | "D" | "G"; delta: number; deltaLabel: string; rostered: string }
type TrendingData = { adds_24h: TrendingPlayer[]; adds_7d: TrendingPlayer[]; drops_24h: TrendingPlayer[]; drops_7d: TrendingPlayer[] }
type LeaderCategory = "FPTS" | "G" | "A" | "SOG" | "HIT" | "BLK" | "W" | "SV" | "SV%" | "SO"
type LeaderMode = "total" | "per_game"
type HorizonMode = "stats" | "projections"
type HockeyHorizon = "Last 7 Days" | "Last 14 Days" | "Last 30 Days" | "Season Totals" | "Season Avg / Per Game" | "This Week" | "Next 14 Days" | "Rest of Season (ROS)"

type TeamAction = "schedule" | "settings" | "transactions" | "news" | "trade"

function TeamHeader({ teamName, pendingClaims, onAction }: { teamName: string; pendingClaims: number; onAction: (action: TeamAction) => void }) {
  const actions = [
    { label: "sched.", icon: Calendar, action: "schedule" as const },
    { label: "trade", icon: ArrowLeftRight, action: "trade" as const },
    { label: "trans.", icon: Receipt, action: "transactions" as const },
    { label: "news", icon: Newspaper, action: "news" as const },
  ]
  return (
    <section className="border-b border-[#111929] bg-[#0d1424] px-3.5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full border border-[#24375b] bg-[#1b2842] text-lg">🏒</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-black text-white">{teamName}</p>
          <p className="text-[10px] font-bold text-[#8ba0c7]">1-1 • 4th</p>
          <p className="text-[10px] text-[#5e7090]">PF 356.06 • PA 318.40</p>
        </div>
        <button type="button" onClick={() => onAction("settings")} aria-label="Team settings" className="rounded-full p-2 text-[#8ba0c7] hover:bg-[#172338]"><Settings className="size-5" /></button>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {actions.map(({ label, icon: Icon, action }) => <button key={label} type="button" onClick={() => onAction(action)} className="flex flex-col items-center gap-1 text-[9px] font-black text-[#8ba0c7] hover:text-[#19ffff]"><span className="relative flex size-8 items-center justify-center rounded-full border border-[#263858] bg-[#141e33]"><Icon className="size-4" />{action === "transactions" && pendingClaims > 0 && <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#f43f5e] text-[9px] font-black text-white shadow-md">{pendingClaims}</span>}</span>{label}</button>)}
      </div>
    </section>
  )
}

function TeamDrawer({
  type,
  roster,
  playerNicknames,
  setNickname,
  teamName,
  setTeamName,
  pendingClaims,
  onCancelClaim,
  onClose,
}: {
  type: Exclude<TeamAction, "trade"> | null
  roster: Player[]
  playerNicknames: Record<string, string>
  setNickname: (id: string, value: string) => void
  teamName: string
  setTeamName: (value: string) => void
  pendingClaims: WaiverClaim[]
  onCancelClaim: (claim: WaiverClaim) => void
  onClose: () => void
}) {
  if (!type) return null
  if (type === "transactions") return <TransactionsDrawer open claims={pendingClaims} activities={activities} onOpenChange={(open) => !open && onClose()} onCancel={onCancelClaim} />
  const title = type === "schedule" ? "Schedule" : type === "settings" ? "My Team Settings" : "Player News"
  return (
    <Sheet open={type !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="mx-auto max-h-[82vh] max-w-[430px] overflow-y-auto rounded-t-2xl border-t border-[#1a263d] bg-[#0d1424] p-0 text-white">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-[#5e7090]" />
        <div className="flex items-center justify-between border-b border-[#172338] px-4 pb-3 pt-2"><h2 className="text-lg font-black">{title}</h2><button type="button" onClick={onClose} aria-label="Close drawer" className="rounded-full p-2 text-[#8ba0c7] hover:bg-[#172338]"><X className="size-5" /></button></div>
        {type === "schedule" && <div className="divide-y divide-[#172338]">{teamSchedule.map((row, index) => <div key={row.week} className="flex items-center gap-3 px-4 py-3"><span className={cn("rounded-md px-2 py-1 text-[10px] font-black", row.week === 8 ? "bg-[#19ffff] text-[#080c14]" : "bg-[#172338] text-[#8ba0c7]")}>Wk {row.week}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-white">{teamName} <span className="text-[#5e7090]">vs</span> {row.opponent}</p><p className="text-[10px] text-[#5e7090]">{row.opponentOwner}</p></div><div className="text-right">{row.result === "SCHEDULED" ? <span className="text-[10px] text-[#5e7090]">TBD</span> : <><p className="text-[10px] tabular-nums text-white">{row.score}</p><span className={cn("text-[9px] font-black", row.result === "WIN" ? "text-emerald-400" : "text-[#ff2a85]")}>{row.result}</span></>}</div></div>)}</div>}
        {type === "settings" && <div className="space-y-4 p-4"><div className="rounded-lg border border-[#172338] bg-[#141e33] p-3"><p className="text-[10px] font-black uppercase text-[#5e7090]">My Team</p><input value={teamName} onChange={(event) => setTeamName(event.target.value)} className="mt-2 w-full rounded-md border border-[#263858] bg-[#0d1424] px-3 py-2 text-sm font-bold text-white outline-none focus:border-[#19ffff]" /></div><div><p className="mb-2 text-sm font-black text-white">Player Nicknames</p><div className="space-y-2">{roster.map((player) => <label key={player.id} className="block rounded-lg border border-[#172338] bg-[#111c30] p-2.5"><span className="block text-xs font-bold text-white">{player.name}</span><input value={playerNicknames[player.id] ?? ""} onChange={(event) => setNickname(player.id, event.target.value)} placeholder="Enter nickname" className="mt-1 w-full bg-transparent text-xs text-[#8ba0c7] outline-none placeholder:text-[#5e7090]" /></label>)}</div></div></div>}
        {type === "news" && <div className="space-y-2 p-4">{playerNews.map((item) => <article key={item.headline} className="flex gap-3 rounded-lg border border-[#172338] bg-[#111c30] p-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1b2842]">🏒</div><div><p className="text-xs font-black text-white">{item.player} <span className="text-[#5e7090]">· {item.team}</span></p><h3 className="mt-1 text-xs font-bold text-[#19ffff]">{item.headline}</h3><p className="mt-1 text-[11px] leading-relaxed text-[#8ba0c7]">{item.analysis}</p></div></article>)}</div>}
      </SheetContent>
    </Sheet>
  )
}

const slotBadgeColors: Record<string, string> = {
  C: "bg-[#1d4ed8] text-white",
  W: "bg-[#0d9488] text-white",
  F: "bg-[#7c3aed] text-white",
  D: "bg-[#b45309] text-white",
  G: "bg-[#0284c7] text-white",
  BN: "bg-[#1e293b] text-[#94a3b8]",
  TAXI: "bg-[#451a03] text-[#f59e0b] border border-[#78350f]",
  IR: "bg-[#4c0519] text-[#f43f5e] border border-[#881337]",
}

const startingSlots: Array<{ slot: "C" | "W" | "F" | "D" | "G"; capacity: number }> = [
  { slot: "C", capacity: 3 },
  { slot: "W", capacity: 6 },
  { slot: "F", capacity: 3 },
  { slot: "D", capacity: 6 },
  { slot: "G", capacity: 2 },
]

export default function SleeperDynastyApp() {
  const [activeTab, setActiveTab] = useState<MainTab>("TEAM")
  const [week, setWeek] = useState(1)
  const [selectedMatchupId, setSelectedMatchupId] = useState(weekMatchups[0].id)
  const [liveMatchups, setLiveMatchups] = useState<Record<string, MatchupSummary & { projectedHome: number; projectedAway: number }>>({})
  const handleLiveSummary = useCallback((summary: MatchupSummary & { projectedHome: number; projectedAway: number }) => {
    setLiveMatchups((current) => ({ ...current, [summary.id]: summary }))
  }, [])
  const [roster, setRoster] = useState<Player[]>(initialRoster)
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDialogTarget | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [editingSlot, setEditingSlot] = useState<Player["slot"] | null>(null)
  const [dmOpen, setDmOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatPreview, setChatPreview] = useState("Priya: Anyone streaming a G tonight? Shesterkin is banged up")
  const [teamDrawer, setTeamDrawer] = useState<"schedule" | "settings" | "transactions" | "news" | null>(null)
  const [playerNicknames, setPlayerNicknames] = useState<Record<string, string>>({})
  const [tradeMode, setTradeMode] = useState(false)
  const [teamName, setTeamName] = useState("Montreal Monarchs")
  const [pendingClaims, setPendingClaims] = useState<WaiverClaim[]>([])
  const [userFaab, setUserFaab] = useState(defaultFaabBudget)
  const [claimPlayer, setClaimPlayer] = useState<MarketPlayer | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [tradeBlock, setTradeBlock] = useState<TradeBlockEntry[]>(league.tradeBlock)
  const [tradeBuilderOpen, setTradeBuilderOpen] = useState(false)
  const [activeTradeFilter, setActiveTradeFilter] = useState<"ALL" | "ACTIVE" | "ACCEPTED" | "REJECTED">("ALL")
  const [tradeOffers, setTradeOffers] = useState<LeagueTradeOffer[]>(() => {
    const marner = getTeamRoster("Toronto Titans", initialRoster).find((player) => player.name === "Mitch Marner")
    return marner ? [{
      id: "offer-toronto-makar-marner",
      senderName: "Jordan",
      senderTeam: "Toronto Titans",
      receiverName: "AlexRoy",
      receiverTeam: "Montreal Monarchs",
      sendingAssets: { players: [marner] },
      receivingAssets: { players: [initialRoster.find((player) => player.name === "Cale Makar")!], picks: [] },
      status: "ACTIVE",
      timestamp: "Today, 8:14 PM",
      isIncoming: true,
    }] : []
  })
  const [counterTrade, setCounterTrade] = useState<{ offer: LeagueTradeOffer; partnerId: string; offering: string[]; receiving: string[] } | null>(null)
  const [prefilledTrade, setPrefilledTrade] = useState<{ partnerId: string; offering: string[]; receiving: string[] } | null>(null)

  function handleRosterMove(playerId: string, destSlot: Player["slot"], targetPlayerId?: string) {
    const source = roster.find((player) => player.id === playerId)
    const target = targetPlayerId ? roster.find((player) => player.id === targetPlayerId) : undefined
    if (!source) return
    setRoster((current) => current.map((player) => {
      if (target && player.id === target.id) return { ...player, slot: source.slot }
      if (player.id === source.id) return { ...player, slot: target ? target.slot : destSlot }
      return player
    }))
    const message = target
      ? `Swapped ${source.name} with ${target.name}`
      : `${source.name} moved to Starting ${destSlot}`
    setToast(message)
    window.setTimeout(() => setToast(null), 3000)
  }

  function submitClaim(claim: WaiverClaim) {
    setPendingClaims((current) => [...current, claim])
    setUserFaab((current) => current - claim.bidAmount)
    setToast(`${claim.playerToAdd.name} has been added to your waivers`)
    window.setTimeout(() => setToast(null), 3000)
  }

  function cancelClaim(claim: WaiverClaim) {
    setPendingClaims((current) => current.filter((item) => item.id !== claim.id))
    setUserFaab((current) => current + claim.bidAmount)
  }

  function toggleTradeBlock(player: PlayerDialogTarget) {
    if (!player.playerId) return
    const existing = tradeBlock.find((entry) => entry.playerId === player.playerId)
    if (existing) {
      setTradeBlock((current) => current.filter((entry) => entry.playerId !== player.playerId))
      setToast(`${player.name} removed from your trade block`)
    } else {
      setTradeBlock((current) => [...current, { playerId: player.playerId!, teamName: teamName, note: "Looking for: Top 4 D or 2027 1st" }])
      setToast(`${player.name} added to your trade block`)
    }

    window.setTimeout(() => setToast(null), 3000)
  }

  function handleInitiateTradeWithPlayer(player: PlayerDialogTarget) {
    const partner = tradePartners.find((candidate) =>
      candidate.players.some((candidatePlayer) => candidatePlayer.id === player.playerId) ||
      candidate.name === player.ownerName ||
      candidate.players.some((candidatePlayer) => candidatePlayer.team === player.team),
    )
    if (!partner || !player.playerId) return
    setSelectedPlayer(null)
    setCounterTrade(null)
    setPrefilledTrade({ partnerId: partner.id, offering: [], receiving: [player.playerId] })
    setTradeBuilderOpen(true)
  }

  function handleLeagueTrade(team: (typeof standings)[number]) {
    const partner = tradePartners.find((candidate) => candidate.name === team.team)
    if (!partner) {
      setToast(`${team.team} is not available for trading right now`)
      window.setTimeout(() => setToast(null), 3000)
      return
    }
    setCounterTrade(null)
    setPrefilledTrade({ partnerId: partner.id, offering: [], receiving: [] })
    setTradeBuilderOpen(true)
  }

  function handleLeaguePlayer(player: Player) {
    setSelectedPlayer({ ...player, owned: player.team === "MTL", playerId: player.id, ownerName: player.team === "MTL" ? teamName : undefined })
  }

    function handleAcceptTrade(tradeId: string) {
      const offer = tradeOffers.find((trade) => trade.id === tradeId)
      if (!offer) return
      setRoster((current) => {
        const outgoingIds = new Set(offer.receivingAssets.players.map((player) => player.id))
        const incoming = offer.sendingAssets.players
          .filter((player) => !current.some((existing) => existing.id === player.id))
          .map((player) => ({ ...player, slot: "BN" as const }))
        return [...current.filter((player) => !outgoingIds.has(player.id)), ...incoming]
      })
      setTradeOffers((current) => current.map((trade) => trade.id === tradeId ? { ...trade, status: "ACCEPTED" } : trade))
      const added = offer.sendingAssets.players[0]?.name ?? "Players"
      setToast(`Trade accepted! ${added} added to your roster.`)
      window.setTimeout(() => setToast(null), 3000)
    }

    function handleDeclineTrade(tradeId: string) {
      setTradeOffers((current) => current.map((trade) => trade.id === tradeId ? { ...trade, status: "REJECTED" } : trade))
      setToast("Trade offer declined.")
      window.setTimeout(() => setToast(null), 3000)
    }

    function handleCounterTrade(offer: LeagueTradeOffer) {
      const partner = tradePartners.find((candidate) => candidate.name === (offer.isIncoming ? offer.senderTeam : offer.receiverTeam))
      if (!partner) return
      setCounterTrade({
        offer,
        partnerId: partner.id,
        offering: offer.receivingAssets.players.map((player) => player.id),
        receiving: offer.sendingAssets.players.map((player) => player.id),
      })
      setTradeBuilderOpen(true)
    }

    function handleSendTrade(trade: TradeProposal) {
      const assetsToPlayers = (assets: TradeProposal["offering"]) => assets.filter((asset) => asset.kind === "player").map((asset) => asset.player)
      const assetsToPicks = (assets: TradeProposal["offering"]) => assets.filter((asset) => asset.kind === "pick").map((asset) => asset.pick.label)
      setTradeOffers((current) => [...current, {
        id: `offer-${Date.now()}`,
        senderName: "AlexRoy",
        senderTeam: teamName,
        receiverName: trade.to.name,
        receiverTeam: trade.to.name,
        sendingAssets: { players: assetsToPlayers(trade.offering), picks: assetsToPicks(trade.offering), faab: trade.faabFrom },
        receivingAssets: { players: assetsToPlayers(trade.receiving), picks: assetsToPicks(trade.receiving), faab: trade.faabTo },
        status: "ACTIVE",
        timestamp: "Just now",
        isIncoming: false,
      }])
      setCounterTrade(null)
      setTradeBuilderOpen(false)
      setToast(`Trade proposal sent to ${trade.to.name}`)
      window.setTimeout(() => setToast(null), 3000)
    }

  const userTradeTeam: TradeTeam = { id: "montreal-monarchs", name: teamName, abbreviation: "MTL", players: roster, faabAvailable: userFaab, draftPicks: draftPicks.map((pick, index) => ({ id: `pick-${index}`, label: `${pick} Round (MTL)`, detail: "Future dynasty pick" })) }
  const tradePartners: TradeTeam[] = weekMatchups.flatMap((matchup) => [matchup.homeTeam, matchup.awayTeam]).filter((name, index, names) => name !== teamName && names.indexOf(name) === index).map((name) => ({ id: name, name, abbreviation: name.slice(0, 3).toUpperCase(), players: getTeamRoster(name, roster), faabAvailable: 100, draftPicks: ["2027 Rd 1", "2027 Rd 2", "2027 Rd 3", "2028 Rd 1"].map((label, index) => ({ id: `${name}-pick-${index}`, label: `${label} (${name.slice(0, 3).toUpperCase()})`, detail: "Rookie pick" })) }))

  const startersCount = roster.filter((p) => ["C", "W", "F", "D", "G"].includes(p.slot)).length
  const bench = roster.filter((p) => p.slot === "BN")
  const taxi = roster.filter((p) => p.slot === "TAXI")
  const ir = roster.filter((p) => p.slot === "IR")

  const orderedStarters = startingSlots.flatMap((group) => {
    const players = roster.filter((p) => p.slot === group.slot)
    const emptyCount = Math.max(0, group.capacity - players.length)
    return [
      ...players.map((p) => ({ player: p, slot: group.slot })),
      ...Array.from({ length: emptyCount }, () => ({ player: null, slot: group.slot })),
    ]
  })

  return (
    <div className="flex min-h-screen justify-center bg-black font-sans antialiased">
      <main className="relative flex h-screen max-h-screen min-h-0 w-full max-w-[430px] flex-col overflow-hidden border-x border-[#121927] bg-[#070a12] shadow-2xl">
        
        {/* Sleeper League Header */}
        <header className="flex items-center justify-between bg-[#070a12] px-3.5 pt-3 pb-2">
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" onClick={() => setDmOpen(true)} aria-label="Open direct messages" className="relative rounded-full p-1 text-zinc-400 hover:bg-[#172338] hover:text-white"><MessageSquare className="size-5" /><span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#f43f5e] text-[9px] font-black text-white">1</span></button>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[#22314d] bg-[#162033] text-xs">🏒</div>
            <h1 className="truncate text-sm font-black uppercase tracking-wider text-white">DYNASTY PUCK LEAGUE...</h1>
          </div>
          <button type="button" className="p-1 text-zinc-400 hover:text-white"><Settings className="size-5" /></button>
        </header>

        {/* 4 Core Tabs */}
        <nav className="flex border-b border-[#141d2f] bg-[#070a12] px-3">
          {(["MATCH", "TEAM", "PLAYERS", "LEAGUE"] as MainTab[]).map((tab) => {
            const active = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative flex-1 py-2.5 text-center text-xs font-black tracking-widest transition-colors",
                  active ? "text-[#19ffff]" : "text-[#5e7090] hover:text-zinc-300"
                )}
              >
                {tab}
                {active && <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-[#19ffff] shadow-[0_0_8px_#19ffff]" />}
              </button>
            )
          })}
        </nav>

        {/* Dynamic Body */}
        <div className={cn("relative z-0 min-h-0 flex flex-1 flex-col pointer-events-auto", activeTab === "LEAGUE" ? "overflow-hidden" : "overflow-y-auto")}>
          {activeTab === "MATCH" && <MatchupPanel roster={roster} teamName={teamName} playerNicknames={playerNicknames} week={week} selectedMatchupId={selectedMatchupId} onMatchupChange={setSelectedMatchupId} onLiveSummary={handleLiveSummary} onWeekChange={setWeek} onMove={handleRosterMove} />}

          {activeTab === "TEAM" && (
            <div className="flex flex-col pb-8">
              <TeamHeader teamName={teamName} pendingClaims={pendingClaims.length} onAction={(action) => {
                if (action === "trade") {
                  setTradeMode(true)
                  setActiveTab("PLAYERS")
                } else setTeamDrawer(action)
              }} />
              {/* Starters Subheader */}
              <div className="flex items-center justify-between border-b border-[#101726] bg-[#070a12] px-3.5 pt-3 pb-2">
                <button type="button" className="flex items-center gap-1 text-xs font-black text-white uppercase tracking-tight">
                  <span>Starters ({startersCount})</span>
                  <ChevronDown className="size-3.5 text-[#5e7090]" />
                </button>
                <div className="flex items-center gap-1 text-xs font-bold text-[#19ffff]">
                  <button type="button" onClick={() => setWeek((w) => Math.max(1, w - 1))} aria-label="Previous team week" className="rounded p-1 hover:bg-[#172338]">
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <span>Week {week}</span>
                  <button type="button" onClick={() => setWeek((w) => w + 1)} aria-label="Next team week" className="rounded p-1 hover:bg-[#172338]">
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Starters Rows */}
              {orderedStarters.map(({ player, slot }, idx) => (
                <PlayerItem
                  key={player ? player.id : `empty-${slot}-${idx}`}
                  player={player}
                  fallbackSlot={slot}
                  onEdit={() => { setEditingPlayer(player); setEditingSlot(player ? null : slot) }}
                  onSelect={() => player && setSelectedPlayer({ ...player, owned: true, playerId: player.id, ownerName: teamName })}
                  nickname={player ? playerNicknames[player.id] : undefined}
                />
              ))}

              {/* Bench */}
              <div className="border-b border-[#101726] bg-[#070a12] px-3.5 pt-4 pb-2 text-xs font-black text-white uppercase tracking-tight">
                Bench ({bench.length})
              </div>
              {bench.map((player) => (
                <PlayerItem
                  key={player.id}
                  player={player}
                  fallbackSlot="BN"
                  onEdit={() => { setEditingSlot(null); setEditingPlayer(player) }}
                  onSelect={() => setSelectedPlayer({ ...player, owned: true, playerId: player.id, ownerName: teamName })}
                  nickname={playerNicknames[player.id]}
                />
              ))}

              {/* Injured Reserve */}
              <div className="border-b border-[#101726] bg-[#070a12] px-3.5 pt-4 pb-2 text-xs font-black text-white uppercase tracking-tight">
                Injured Reserve
              </div>
              {ir.length > 0 ? (
                ir.map((player) => (
                  <PlayerItem
                    key={player.id}
                    player={player}
                    fallbackSlot="IR"
                    onEdit={() => setEditingPlayer(player)}
                    onSelect={() => setSelectedPlayer({ ...player, owned: true, playerId: player.id, ownerName: teamName })}
                    nickname={playerNicknames[player.id]}
                  />
                ))
              ) : (
                <div className="flex items-center gap-2.5 border-b border-[#0f1726] px-3.5 py-2">
                  <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-[5px] text-[11px] font-black uppercase", slotBadgeColors.IR)}>IR</span>
                  <span className="text-xs font-bold text-[#45546d]">Empty</span>
                </div>
              )}

              {/* Taxi Squad */}
              <div className="flex items-center justify-between border-b border-[#101726] bg-[#070a12] px-3.5 pt-4 pb-2 text-xs font-black text-white uppercase tracking-tight">
                <span>Taxi Squad</span>
                <span className="text-[10px] text-amber-400 font-bold">&lt; 80 NHL GP</span>
              </div>
              {taxi.map((player) => (
                <div key={player.id} className="flex items-center justify-between border-b border-[#0f1726] px-3.5 py-2">
                  <div className="flex items-center gap-2.5">
                    <button type="button" onClick={() => setEditingPlayer(player)} className={cn("flex size-7 shrink-0 items-center justify-center rounded-[5px] text-[11px] font-black uppercase", slotBadgeColors.TAXI)}>
                      TX
                    </button>
                    <div>
                      <p className="text-xs font-bold text-white">{player.name}</p>
                      {playerNicknames[player.id] && <p className="text-[10px] italic text-[#5e7090]">{playerNicknames[player.id]}</p>}
                      <p className="text-[10px] text-[#5e7090]">{player.team} • {player.gamesPlayed ?? 0} GP</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-white tabular-nums">0.00</span>
                </div>
              ))}

              {/* Future Draft Picks */}
              <div className="px-3.5 pt-5 pb-2 text-xs font-black text-white uppercase tracking-tight">Draft Picks</div>
              <div className="flex flex-col px-3.5">
                {draftPicks.map((pick, i) => (
                  <div key={i} className="py-2 border-b border-[#0f1726] text-xs font-bold text-[#7d8fa9]">{pick} Round (AlexRoy Std)</div>
                ))}
              </div>

              {/* Watermark */}
              <div className="mt-8 flex items-center justify-center gap-1.5 text-zinc-600 opacity-60">
                <span>⚡</span>
                <span className="text-xs font-black tracking-widest uppercase">sleeper</span>
              </div>
            </div>
          )}

          {activeTab === "PLAYERS" && <PlayersMarketView roster={roster} tradeBlock={tradeBlock} tradeOffers={tradeOffers} onAcceptTrade={handleAcceptTrade} onDeclineTrade={handleDeclineTrade} onCounterTrade={handleCounterTrade} onInitiateTrade={handleInitiateTradeWithPlayer} onSelect={(player) => setSelectedPlayer(player)} onClaim={setClaimPlayer} onOpenTradeBuilder={() => { setCounterTrade(null); setPrefilledTrade(null); setTradeBuilderOpen(true) }} activeTradeFilter={activeTradeFilter} setActiveTradeFilter={setActiveTradeFilter} tradeMode={tradeMode} />}
          {activeTab === "LEAGUE" && <LeagueFeed week={week} onWeekChange={setWeek} onSelectMatchup={(matchupId) => { setSelectedMatchupId(matchupId); setActiveTab("MATCH") }} liveMatchups={liveMatchups} standings={standings} matchups={weekMatchups} activities={activities} roster={roster} onTrade={handleLeagueTrade} onSelectPlayer={handleLeaguePlayer} onSettings={() => setTeamDrawer("settings")} />}
        </div>

        <LeagueChatDrawer
          open={chatOpen}
          onOpenChange={setChatOpen}
          latestPreview={chatPreview}
          onLatestMessage={(message) => setChatPreview(`You: ${message}`)}
        />

        {/* Active Modals */}
        <PlayerDetailDialog player={selectedPlayer} open={selectedPlayer !== null} tradeBlockActive={selectedPlayer?.playerId ? tradeBlock.some((entry) => entry.playerId === selectedPlayer.playerId) : false} onToggleTradeBlock={toggleTradeBlock} onInitiateTrade={handleInitiateTradeWithPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)} onSelectPlayer={setSelectedPlayer} onClaim={(target) => {
          setSelectedPlayer(null)
          if (target.marketPlayer) setClaimPlayer(target.marketPlayer)
        }} />
        <TradeBuilderDialog open={tradeBuilderOpen} onOpenChange={(open) => { setTradeBuilderOpen(open); if (!open) { setCounterTrade(null); setPrefilledTrade(null) } }} team={userTradeTeam} partners={tradePartners} initialPartnerId={counterTrade?.partnerId ?? prefilledTrade?.partnerId} initialOffering={counterTrade?.offering ?? prefilledTrade?.offering} initialReceiving={counterTrade?.receiving ?? prefilledTrade?.receiving} onPlayerClick={(player) => setSelectedPlayer({ ...player, owned: player.team === "MTL", playerId: player.id })} onSendTrade={handleSendTrade} />
        <LineupSlotDialog player={editingPlayer} emptySlot={editingSlot as Extract<Player["slot"], "C" | "W" | "F" | "D" | "G"> | null} roster={roster} open={editingPlayer !== null || editingSlot !== null} onOpenChange={(open) => { if (!open) { setEditingPlayer(null); setEditingSlot(null) } }} onMove={handleRosterMove} />
        <DirectMessagesDialog open={dmOpen} onOpenChange={setDmOpen} onTrade={(conversation) => { const partner = standings.find((team) => team.team === conversation.teamName); if (partner) { setDmOpen(false); handleLeagueTrade(partner) } }} />
        <TeamDrawer
          type={teamDrawer}
          roster={roster}
          playerNicknames={playerNicknames}
          setNickname={(id, value) => setPlayerNicknames((current) => ({ ...current, [id]: value }))}
          onClose={() => setTeamDrawer(null)}
          teamName={teamName}
          setTeamName={setTeamName}
          pendingClaims={pendingClaims}
          onCancelClaim={cancelClaim}
        />
        <WaiverClaimDialog player={claimPlayer} roster={roster} userFaab={userFaab} teamName={teamName} open={claimPlayer !== null} onOpenChange={(open) => !open && setClaimPlayer(null)} onConfirm={submitClaim} />
        {toast && <div className="absolute inset-x-4 top-3 z-[60] flex items-center gap-2 rounded-full border border-[#19ffff]/50 bg-[#10283a] px-4 py-3 text-xs font-bold text-white shadow-lg"><Check className="size-4 text-[#19ffff]" />{toast}</div>}
      </main>
    </div>
  )
}

// ----------------- SUB-COMPONENTS (Cleanly extracted outside) -----------------

function PlayerItem({
  player,
  fallbackSlot,
  onEdit,
  onSelect,
  nickname,
}: {
  player: Player | null
  fallbackSlot: string
  onEdit: () => void
  onSelect: () => void
  nickname?: string
}) {
  if (!player) {
    return (
      <div onClick={onEdit} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onEdit() }} className="flex cursor-pointer items-center justify-between border-b border-[#0f1726] px-3.5 py-2 transition-colors hover:bg-[#16233b] active:scale-[0.99]">
        <div className="flex items-center gap-2.5">
          <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-[5px] text-[11px] font-black uppercase", slotBadgeColors[fallbackSlot])}>
            {fallbackSlot}
          </span>
          <span className="text-xs font-bold text-[#45546d]">Empty</span>
        </div>
        <span className="text-xs font-bold text-[#45546d]">—</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between border-b border-[#0f1726] px-3.5 py-2 hover:bg-[#0c1220] transition-colors">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={onEdit}
          className={cn("flex size-7 shrink-0 items-center justify-center rounded-[5px] text-[11px] font-black uppercase transition-transform active:scale-95", slotBadgeColors[player.slot] || slotBadgeColors[player.position])}
        >
          {player.slot}
        </button>

        <div onClick={onSelect} className="flex min-w-0 items-center gap-2.5 cursor-pointer">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#1b263b] bg-[#121a29] text-xs">
            🏒
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-xs font-bold text-white tracking-tight leading-tight">{player.name}</p>
              {player.status && (
                <span className={cn("shrink-0 rounded px-1 text-[8px] font-black uppercase", player.status === "DTD" ? "bg-amber-400/20 text-amber-300" : "bg-[#ff2a85]/20 text-[#ff2a85]")}>
                  {player.status}
                </span>
              )}
            </div>
            {nickname && <p className="truncate text-[10px] italic text-[#5e7090]">{nickname}</p>}
            <p className="truncate text-[10px] text-[#5e7090] leading-tight">
              <span className="font-semibold text-zinc-300">{player.position}</span> - {player.team} • {player.opponent}
            </p>
          </div>
        </div>
      </div>

      <div onClick={onSelect} className="text-right shrink-0 cursor-pointer pl-2">
        <p className="text-xs font-black text-white tabular-nums leading-tight">{player.todayPts != null ? player.todayPts.toFixed(2) : "—"}</p>
        <p className="text-[10px] font-semibold text-[#5e7090] tabular-nums leading-tight">{player.projPts.toFixed(1)}</p>
      </div>
    </div>
  )
}

function PlayersMarketView({ roster, tradeBlock, tradeOffers, onAcceptTrade, onDeclineTrade, onCounterTrade, onInitiateTrade, onSelect, onClaim, onOpenTradeBuilder, activeTradeFilter, setActiveTradeFilter, tradeMode = false }: { roster: Player[]; tradeBlock: TradeBlockEntry[]; tradeOffers: LeagueTradeOffer[]; onAcceptTrade: (tradeId: string) => void; onDeclineTrade: (tradeId: string) => void; onCounterTrade: (trade: LeagueTradeOffer) => void; onInitiateTrade: (player: PlayerDialogTarget) => void; onSelect: (player: PlayerDialogTarget) => void; onClaim: (player: MarketPlayer) => void; onOpenTradeBuilder: () => void; activeTradeFilter: "ALL" | "ACTIVE" | "ACCEPTED" | "REJECTED"; setActiveTradeFilter: (filter: "ALL" | "ACTIVE" | "ACCEPTED" | "REJECTED") => void; tradeMode?: boolean }) {
  const [subTab, setSubTab] = useState<"search" | "trend" | "available" | "leaders" | "trade">(tradeMode ? "trade" : "available")
  const [filter, setFilter] = useState<PositionFilter>("ALL")
  const [availability, setAvailability] = useState<"ALL" | "FA" | "W">("ALL")
  const [settings, setSettings] = useState<PlayerGridSettings>({ viewType: "Projections", period: "This Week", year: "2026" })
  const [horizonMode, setHorizonMode] = useState<HorizonMode>("projections")
  const [horizon, setHorizon] = useState<HockeyHorizon>("This Week")
  const [gridView, setGridView] = useState<"grid" | "list">("grid")
  const players = marketPlayers.filter((p) => (filter === "ALL" || (filter === "W" ? ["LW", "RW"].includes(p.position) : p.position === filter)) && (availability === "ALL" || (availability === "FA" ? p.waiver === "FA" : p.waiver !== "FA")))
  const selectPlayer = (p: MarketPlayer) => onSelect({ name: p.name, position: p.position, team: p.team, opponent: "vs BOS", status: null, todayPts: p.fpts, projPts: horizonMode === "projections" ? getProjectedFPTS(p, horizon === "This Week" ? 3.5 : horizon === "Next 14 Days" ? 7 : 28) : p.fpts, marketPlayer: p })
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-12 border-b border-[#141e33] px-2 py-2 text-[#5e7090]">
        {[{ id: "search" as const, label: "Search", Icon: Search }, { id: "trend" as const, label: "Trend", Icon: TrendingUp }, { id: "available" as const, label: "Available", Icon: Check }, { id: "leaders" as const, label: "Leaders", Icon: Award }, { id: "trade" as const, label: "Trade", Icon: ArrowLeftRight }].map(({ id, label, Icon }) => <button key={label} type="button" onClick={() => setSubTab(id)} className={cn("relative flex cursor-pointer flex-col items-center gap-1 text-[9px] font-bold transition-all duration-150 hover:bg-[#111c2e]/60 hover:text-white active:scale-95", subTab === id && "text-[#19ffff] [text-shadow:0_0_8px_rgba(25,255,255,0.5)]")}>{subTab === id && <span className="absolute inset-x-2 -bottom-2 h-0.5 rounded-full bg-[#19ffff]" />}<Icon className="size-4" />{label}</button>)}
      </div>
      {subTab !== "trend" && subTab !== "trade" && <div className="border-b border-[#111929] bg-[#0b1220] px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <button type="button" onClick={() => { setHorizonMode("stats"); setHorizon("Last 14 Days"); setSettings({ ...settings, viewType: "Stats", period: "Last 14 Days" }) }} className={cn("rounded-full px-2.5 py-1 text-[10px] font-black", horizonMode === "stats" ? "bg-[#19ffff] text-[#080c14]" : "border border-[#1b2842] bg-[#101829] text-[#8ba0c7]")}>STATS</button>
            <button type="button" onClick={() => { setHorizonMode("projections"); setHorizon("Next 14 Days"); setSettings({ ...settings, viewType: "Projections", period: "Next 14 Days" }) }} className={cn("rounded-full px-2.5 py-1 text-[10px] font-black", horizonMode === "projections" ? "bg-[#19ffff] text-[#080c14]" : "border border-[#1b2842] bg-[#101829] text-[#8ba0c7]")}>PROJECTIONS</button>
          </div>
          <select aria-label="Hockey time horizon" value={horizon} onChange={(event) => { const next = event.target.value as HockeyHorizon; setHorizon(next); setSettings({ ...settings, period: next }) }} className="max-w-[155px] rounded-full border border-[#1b2842] bg-[#101829] px-2.5 py-1 text-[10px] font-black text-[#8ba0c7] outline-none">
            {(horizonMode === "stats" ? ["Last 7 Days", "Last 14 Days", "Last 30 Days", "Season Totals", "Season Avg / Per Game"] : ["This Week", "Next 14 Days", "Rest of Season (ROS)"]).map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
      </div>}
      {subTab !== "available" ? <PlayersSubTabView tab={subTab} roster={roster} tradeBlock={tradeBlock} tradeOffers={tradeOffers} onAcceptTrade={onAcceptTrade} onDeclineTrade={onDeclineTrade} onCounterTrade={onCounterTrade} onInitiateTrade={onInitiateTrade} horizonMode={horizonMode} horizon={horizon} onSelect={onSelect} onClaim={onClaim} onOpenTradeBuilder={onOpenTradeBuilder} activeTradeFilter={activeTradeFilter} setActiveTradeFilter={setActiveTradeFilter} /> : <>
      <div className="border-b border-[#111929] px-3 py-2">
        <div className="flex items-center gap-2"><h2 className="text-sm font-black text-white">{tradeMode ? "Trade Center" : "Available"}</h2><button type="button" onClick={() => setGridView(gridView === "grid" ? "list" : "grid")} className="cursor-pointer text-[#5e7090] transition-all duration-150 hover:text-white active:scale-95">{gridView === "grid" ? <List className="size-4" /> : <Grid2X2 className="size-4" />}</button><div className="flex gap-1.5">{(["ALL", "FA", "W"] as const).map((value) => <button key={value} type="button" onClick={() => setAvailability(value)} className={cn("rounded-full border px-2 py-0.5 text-[9px] font-black transition-all duration-150 active:scale-95", availability === value ? "border-[#19ffff] bg-[#19ffff] text-[#080c14]" : "border-[#17233c] bg-[#101829] text-[#5e7090] cursor-pointer hover:bg-[#16233b] hover:border-[#2a3f66] hover:text-white")}>{value}</button>)}</div></div>
      </div>
      <div className="flex gap-1.5 overflow-x-auto border-b border-[#111929] px-3 py-1.5">{(["ALL", "C", "W", "F", "D", "G"] as PositionFilter[]).map((pos) => <button key={pos} type="button" onClick={() => setFilter(pos)} className={cn("rounded-full border px-2.5 py-0.5 text-[9px] font-black transition-all duration-150 active:scale-95", filter === pos ? "border-[#19ffff] bg-[#19ffff] text-black hover:brightness-110" : "cursor-pointer border-[#17233c] bg-[#101829] text-[#5e7090] hover:bg-[#16233b] hover:border-[#2a3f66] hover:text-white")}>{pos}</button>)}</div>
      <div className={cn("border-y border-[#111929]", gridView === "grid" && "grid grid-cols-2 gap-px bg-[#111929]")}>
        {players.slice(0, 50).map((p) => <div key={p.name} onClick={() => selectPlayer(p)} className="cursor-pointer border-b border-[#111929] bg-[#0d1424] p-3 transition-colors duration-150 hover:bg-[#0f1828]/80">
          <div className="flex items-start gap-2"><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1b2842]">🏒</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-black text-white">{p.name}</p><p className="text-[10px] text-[#5e7090]">{p.position} · {p.team} · vs BOS</p><button type="button" onClick={(event) => { event.stopPropagation(); onClaim(p) }} className={cn("mt-1 cursor-pointer rounded px-1 py-0.5 text-[9px] font-black transition-all duration-150 active:scale-95", p.waiver === "FA" ? "bg-emerald-400/15 text-emerald-300 hover:brightness-110" : "bg-amber-400/15 text-amber-300 hover:brightness-110")}>{p.waiver}</button></div><button type="button" aria-label={`Add or claim ${p.name}`} onClick={(event) => { event.stopPropagation(); onClaim(p) }} className="flex size-6 cursor-pointer items-center justify-center rounded-full border border-[#19ffff]/50 text-[#19ffff] transition-all duration-150 hover:scale-110 hover:bg-[#19ffff] hover:text-[#080c14] hover:border-[#19ffff] hover:shadow-[0_0_10px_rgba(25,255,255,0.4)] active:scale-90"><Plus className="size-3.5" /></button></div>
          {settings.viewType === "Projections" && <div className="mt-3 grid grid-cols-4 gap-1 text-[9px] text-[#5e7090]"><span>FPTS <b className="block text-xs text-white">{getProjectedFPTS(p, horizon === "This Week" ? 3.5 : horizon === "Next 14 Days" ? 7 : 28).toFixed(1)}</b></span><span>G <b className="block text-white">{(p.goals / p.gp * 82).toFixed(0)}</b></span><span>A <b className="block text-white">{(p.assists / p.gp * 82).toFixed(0)}</b></span><span>SOG <b className="block text-white">{(p.sog / p.gp * 82).toFixed(0)}</b></span></div>}
          {settings.viewType === "Stats" && <div className="mt-3 grid grid-cols-4 gap-1 text-[9px] text-[#5e7090]"><span>GP <b className="block text-white">{p.gp}</b></span><span>G <b className="block text-white">{p.goals}</b></span><span>A <b className="block text-white">{p.assists}</b></span><span>FPTS <b className="block text-emerald-300">{getProjectedFPTS(p, p.gp).toFixed(1)}</b></span><span>SOG <b className="block text-white">{p.sog}</b></span><span>HIT <b className="block text-white">{p.hits}</b></span><span>BLK <b className="block text-white">{p.blocks}</b></span></div>}
          {settings.viewType === "ADP" && <div className="mt-3 flex justify-between text-[10px] font-black text-[#8ba0c7]"><span>ADP {p.adp}</span><span>{p.rostered} ROST</span></div>}
        </div>)}
      </div>
      </>}
    </div>
  )
}

function MarketPlayerRow({ player, onSelect, onClaim, meta }: { player: MarketPlayer; onSelect: (player: PlayerDialogTarget) => void; onClaim?: (player: MarketPlayer) => void; meta?: React.ReactNode }) {
  const target = { name: player.name, position: player.position, team: player.team, opponent: "vs BOS", status: null as PlayerStatus, todayPts: player.fpts, projPts: player.projection, marketPlayer: player }
  return <button type="button" onClick={() => onSelect(target)} className="flex w-full items-center gap-2 border-b border-[#172338] px-3 py-2.5 text-left transition-colors hover:bg-[#0f1828]/80"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1b2842]">🏒</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-black text-white">{player.name}</span><span className="block text-[10px] text-[#5e7090]"><b className={cn("mr-1 rounded px-1", player.position === "G" ? "bg-sky-400/20 text-sky-300" : player.position === "D" ? "bg-amber-400/20 text-amber-300" : player.position === "C" ? "bg-blue-400/20 text-blue-300" : "bg-teal-400/20 text-teal-300")}>{player.position}</b>{player.team} · {player.waiver === "FA" ? "FA" : player.waiver}</span></span>{meta}<span className="text-xs font-black tabular-nums text-[#19ffff]">{player.projection.toFixed(1)}</span>{onClaim && <span role="button" tabIndex={0} aria-label={`Claim ${player.name}`} onClick={(event) => { event.stopPropagation(); onClaim(player) }} className="flex size-6 items-center justify-center rounded-full border border-[#19ffff]/50 text-[#19ffff] hover:bg-[#19ffff] hover:text-[#080c14]">+</span>}</button>
}

function TrendPlayerRow({ player, rank, onSelect, onClaim }: { player: TrendingPlayer; rank: number; onSelect: (player: PlayerDialogTarget) => void; onClaim?: (player: MarketPlayer) => void }) {
  const marketPlayer: MarketPlayer = { rank, name: player.name, position: player.position, team: player.team, waiver: "FA", velocity: player.deltaLabel, rostered: player.rostered, trend: `${player.delta}%`, fpts: 0, projection: 0, gp: 0, goals: 0, assists: 0, sog: 0, hits: 0, blocks: 0, adp: 0 }
  const target: PlayerDialogTarget = { name: player.name, position: player.position, team: player.team, opponent: "vs BOS", status: null, todayPts: null, projPts: 0, marketPlayer }
  const badgeClass = player.delta > 0 ? "bg-emerald-400/15 text-emerald-300" : "bg-[#ff2a85]/15 text-[#ff2a85]"
  const positionClass = player.position === "G" ? "bg-sky-500 text-white" : player.position === "D" ? "bg-amber-600 text-white" : player.position === "C" ? "bg-blue-600 text-white" : "bg-teal-600 text-white"
  return <button type="button" onClick={() => onSelect(target)} className="flex w-full items-center gap-2 border-b border-[#172338] px-3 py-2.5 text-left transition-colors hover:bg-[#0f1828]/80">
    <span className="w-5 text-center text-xs font-black text-[#5e7090]">#{rank}</span>
    <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-md text-[9px] font-black", positionClass)}>{player.position}</span>
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1b2842]">🏒</span>
    <span className="min-w-0 flex-1"><span className="block truncate text-xs font-black text-white">{player.name}</span><span className="block truncate text-[10px] text-[#5e7090]">{player.team} · vs BOS · {player.rostered}</span></span>
    <span className={cn("shrink-0 rounded px-1.5 py-1 text-[10px] font-black tabular-nums", badgeClass)}>{player.deltaLabel.replace(" adds", "").replace(" drops", "")}</span>
    {onClaim && <span role="button" tabIndex={0} aria-label={`Claim ${player.name}`} onClick={(event) => { event.stopPropagation(); onClaim(marketPlayer) }} className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#19ffff]/50 text-[#19ffff] hover:bg-[#19ffff] hover:text-[#080c14]">+</span>}
  </button>
}

type SearchPlayer = (Player | MarketPlayer) & { id: string; owner: string }

const normalizeSearchText = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

function getLeaderStat(player: SearchPlayer, category: LeaderCategory, mode: LeaderMode, projectionGames?: number): { numeric: number; display: string } {
  const source = "stats" in player && player.stats ? player.stats : player
  const rawGp = Number("gp" in source ? source.gp : "gamesPlayed" in player ? player.gamesPlayed : "gp" in player ? player.gp : 20)
  const gp = Number.isFinite(rawGp) ? Math.max(1, rawGp) : 1
  const stats = source as unknown as Record<string, number | undefined>
  if (category === "SV%") {
    const savePct = stats.savePct ?? ("savePct" in player ? player.savePct : 0.915) ?? 0.915
    return { numeric: savePct, display: savePct.toFixed(3) }
  }

  const calculatedFpts = player.position === "G"
    ? calculateGoalieFPTS({
        gp,
        wins: Number(stats.wins ?? ("wins" in player ? player.wins : 0)) || 0,
        saves: Number(stats.saves ?? ("saves" in player ? player.saves : 0)) || 0,
        goalsAgainst: Number(stats.goalsAgainst ?? 0) || 0,
        shutouts: Number(stats.shutouts ?? ("shutouts" in player ? player.shutouts : 0)) || 0,
        savePct: Number(stats.savePct ?? ("savePct" in player ? player.savePct : 0.915)) || 0.915,
      })
    : calculateSkaterFPTS({
        gp,
        goals: Number(stats.goals ?? ("goals" in player ? player.goals : 0)) || 0,
        assists: Number(stats.assists ?? ("assists" in player ? player.assists : 0)) || 0,
        sog: Number(stats.sog ?? ("sog" in player ? player.sog : 0)) || 0,
        hits: Number(stats.hits ?? ("hits" in player ? player.hits : 0)) || 0,
        blocks: Number(stats.blocks ?? ("blocks" in player ? player.blocks : 0)) || 0,
        ppp: Number(stats.ppp ?? 0) || 0,
        shg: Number(stats.shg ?? 0) || 0,
        gwg: Number(stats.gwg ?? 0) || 0,
      })
  const total = (category === "FPTS"
    ? projectionGames ? (calculatedFpts / gp) * projectionGames : calculatedFpts
    : category === "G" ? stats.goals ?? ("goals" in player ? player.goals : 0)
    : category === "A" ? stats.assists ?? ("assists" in player ? player.assists : 0)
    : category === "SOG" ? stats.sog ?? ("sog" in player ? player.sog : 0)
    : category === "HIT" ? stats.hits ?? ("hits" in player ? player.hits : 0)
    : category === "BLK" ? stats.blocks ?? ("blocks" in player ? player.blocks : 0)
    : category === "W" ? stats.wins ?? ("wins" in player ? player.wins : 0)
    : category === "SV" ? stats.saves ?? ("saves" in player ? player.saves : 0)
    : stats.shutouts ?? ("shutouts" in player ? player.shutouts : 0)) ?? 0
  const numeric = mode === "per_game" ? total / gp : total
  return { numeric, display: mode === "per_game" ? numeric.toFixed(category === "FPTS" ? 1 : 2) : category === "FPTS" ? numeric.toFixed(1) : Math.round(numeric).toString() }
}

function getProjectedFPTS(player: MarketPlayer, games: number): number {
  const stats = player.stats ?? (player.position === "G"
    ? { gp: player.gp, wins: player.wins ?? 0, saves: player.saves ?? 0, goalsAgainst: Math.max(1, Math.round((player.saves ?? 0) * (1 - (player.savePct ?? 0.915)))), shutouts: player.shutouts ?? 0, savePct: player.savePct ?? 0.915 }
    : { gp: player.gp, goals: player.goals, assists: player.assists, sog: player.sog, hits: player.hits, blocks: player.blocks, ppp: 2, gwg: 1, shg: 0 })
  const seasonFpts = player.position === "G" ? calculateGoalieFPTS(stats as GoalieStats) : calculateSkaterFPTS(stats as SkaterStats)
  return Number(((seasonFpts / Math.max(1, stats.gp)) * games).toFixed(1))
}

function PlayersSubTabView({ tab, roster, tradeBlock, tradeOffers, onAcceptTrade, onDeclineTrade, onCounterTrade, onInitiateTrade, horizonMode, horizon, onSelect, onClaim, onOpenTradeBuilder, activeTradeFilter, setActiveTradeFilter }: { tab: "search" | "trend" | "leaders" | "trade"; roster: Player[]; tradeBlock: TradeBlockEntry[]; tradeOffers: LeagueTradeOffer[]; onAcceptTrade: (tradeId: string) => void; onDeclineTrade: (tradeId: string) => void; onCounterTrade: (trade: LeagueTradeOffer) => void; onInitiateTrade: (player: PlayerDialogTarget) => void; horizonMode: HorizonMode; horizon: HockeyHorizon; onSelect: (player: PlayerDialogTarget) => void; onClaim: (player: MarketPlayer) => void; onOpenTradeBuilder: () => void; activeTradeFilter: "ALL" | "ACTIVE" | "ACCEPTED" | "REJECTED"; setActiveTradeFilter: (filter: "ALL" | "ACTIVE" | "ACCEPTED" | "REJECTED") => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSearchPos, setSelectedSearchPos] = useState("ALL")
  const [searchOwnerFilter, setSearchOwnerFilter] = useState("ALL")
  const [searchTeamFilter, setSearchTeamFilter] = useState("ALL")
  const [trendTab, setTrendTab] = useState<"adds" | "drops">("adds")
  const [trendingData, setTrendingData] = useState<TrendingData>({ adds_24h: [], adds_7d: [], drops_24h: [], drops_7d: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<"24 HR" | "7 DAYS">("24 HR")
  const [leaderCategory, setLeaderCategory] = useState<LeaderCategory>("FPTS")
  const [leaderPosFilter, setLeaderPosFilter] = useState<"ALL" | "C" | "W" | "D" | "G">("ALL")
  const leaderMode: LeaderMode = horizon === "Season Avg / Per Game" ? "per_game" : "total"
  const goalieCategories: LeaderCategory[] = ["FPTS", "W", "SV", "SV%", "SO"]
  const skaterCategories: LeaderCategory[] = ["FPTS", "G", "A", "SOG", "HIT", "BLK"]
  const leaderCategories = leaderPosFilter === "G" ? goalieCategories : skaterCategories
  const selectLeaderPosition = (position: "ALL" | "C" | "W" | "D" | "G") => {
    setLeaderPosFilter(position)
    if (position === "G" && !goalieCategories.includes(leaderCategory)) setLeaderCategory("FPTS")
    if (position !== "G" && ["W", "SV", "SV%", "SO"].includes(leaderCategory)) setLeaderCategory("FPTS")
  }
  const selectLeaderCategory = (category: LeaderCategory) => {
    setLeaderCategory(category)
    if (["W", "SV", "SV%", "SO"].includes(category) && leaderPosFilter !== "G") setLeaderPosFilter("G")
  }
  useEffect(() => {
    let mounted = true
    fetch("/api/trending")
      .then((response) => {
        if (!response.ok) throw new Error(`Trending request failed: ${response.status}`)
        return response.json() as Promise<TrendingData>
      })
      .then((data) => {
        if (mounted) setTrendingData({ adds_24h: data.adds_24h ?? [], adds_7d: data.adds_7d ?? [], drops_24h: data.drops_24h ?? [], drops_7d: data.drops_7d ?? [] })
      })
      .catch(() => {
        if (mounted) setTrendingData({ adds_24h: [], adds_7d: [], drops_24h: [], drops_7d: [] })
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])
  const allRosters = useMemo(() => {
    const teamNames = new Set<string>()
    weekMatchups.forEach((matchup) => {
      teamNames.add(matchup.homeTeam)
      teamNames.add(matchup.awayTeam)
    })
    return Array.from(teamNames)
      .filter((teamName) => teamName !== "Montreal Monarchs")
      .map((teamName) => ({ teamName, players: getTeamRoster(teamName, roster) }))
  }, [roster])

  const allLeaguePlayers = useMemo<SearchPlayer[]>(() => {
    const map = new Map<string, SearchPlayer>()
    const rosterIdsByName = new Map(roster.map((player) => [normalizeSearchText(player.name), player.id]))
    const withSeasonStats = (player: Player): Player => {
      const stats = player.stats ?? createPlayerSeasonStats(player)
      return {
        ...player,
        stats,
        projPts: Math.round((calculatePlayerFPTS({ ...player, stats }) / stats.gp) * 3.5 * 10) / 10,
      }
    }

    roster.forEach((player) => map.set(player.id, { ...withSeasonStats(player), owner: "You" }))
    allRosters.forEach((teamRoster) => {
      teamRoster.players.forEach((player) => {
        if (!map.has(player.id)) map.set(player.id, { ...withSeasonStats(player), owner: teamRoster.teamName })
      })
    })
    marketPlayers.forEach((player) => {
      const id = rosterIdsByName.get(normalizeSearchText(player.name)) ?? `market-${player.rank}-${normalizeSearchText(player.name).replace(/\s+/g, "-")}`
      if (!map.has(id)) {
        const stats = player.stats ?? (player.position === "G"
          ? { gp: player.gp, wins: player.wins ?? 0, saves: player.saves ?? 0, goalsAgainst: Math.max(1, Math.round((player.saves ?? 0) * (1 - (player.savePct ?? 0.915)))), shutouts: player.shutouts ?? 0, savePct: player.savePct ?? 0.915 }
          : { gp: player.gp, goals: player.goals, assists: player.assists, sog: player.sog, hits: player.hits, blocks: player.blocks, ppp: 2, gwg: 1, shg: 0 })
        map.set(id, { ...player, id, stats, owner: player.waiver || "FA" })
      }
    })
    return Array.from(map.values())
  }, [roster, allRosters])

  const filteredSearchResults = useMemo(() => {
    const query = normalizeSearchText(searchQuery.trim())
    return allLeaguePlayers.filter((player) => {
      const normalizedName = normalizeSearchText(player.name)
      const matchesText = !query ||
        normalizedName.includes(query) ||
        normalizeSearchText(player.team).includes(query) ||
        normalizeSearchText(player.position) === query
      const matchesPos = selectedSearchPos === "ALL" ||
        player.position === selectedSearchPos ||
        (selectedSearchPos === "W" && ["LW", "RW", "W"].includes(player.position)) ||
        (selectedSearchPos === "F" && ["C", "LW", "RW", "W", "F"].includes(player.position))
      const matchesOwner = searchOwnerFilter === "ALL" ||
        (searchOwnerFilter === "AVAILABLE" && (player.owner === "FA" || player.owner.startsWith("W"))) ||
        (searchOwnerFilter === "ROSTERED" && player.owner !== "FA" && !player.owner.startsWith("W"))
      const matchesTeam = searchTeamFilter === "ALL" || player.team === searchTeamFilter
      return matchesText && matchesPos && matchesOwner && matchesTeam
    })
  }, [allLeaguePlayers, searchQuery, selectedSearchPos, searchOwnerFilter, searchTeamFilter])
  const sortedLeaders = useMemo(() => {
    const goalieCategory = ["W", "SV", "SV%", "SO"].includes(leaderCategory)
    const goaliePositionFilter = leaderPosFilter === "G"
    const skaterPositionFilter = ["C", "W", "D"].includes(leaderPosFilter)
    const eligiblePool = allLeaguePlayers.filter((player) => {
      if (goalieCategory || goaliePositionFilter) return player.position === "G"
      if (skaterPositionFilter) return player.position !== "G"
      return true
    })
    const filteredByPos = eligiblePool.filter((player) => {
      if (leaderPosFilter === "ALL") return true
      if (leaderPosFilter === "C") return player.position === "C"
      if (leaderPosFilter === "W") return ["W", "LW", "RW"].includes(player.position)
      if (leaderPosFilter === "D") return ["D", "LD", "RD"].includes(player.position)
      if (leaderPosFilter === "G") return player.position === "G"
      return true
    })
    return filteredByPos
      .map((player) => {
        const projectionGames = horizonMode === "projections" ? horizon === "This Week" ? 3.5 : horizon === "Next 14 Days" ? 7 : 28
          : undefined
        const stat = getLeaderStat(player, leaderCategory, leaderMode, projectionGames)
        return { player, rawValue: stat.numeric, displayValue: stat.display }
      })
      .sort((a, b) => b.rawValue - a.rawValue)
      .map((item, index) => ({ ...item, rank: index + 1 }))
  }, [allLeaguePlayers, leaderCategory, leaderMode, leaderPosFilter, horizon, horizonMode])

  if (tab === "search") {
    const toTarget = (player: SearchPlayer): PlayerDialogTarget => {
      if ("slot" in player) return player
      return {
        name: player.name,
        position: player.position,
        team: player.team,
        opponent: "vs BOS",
        status: null,
        todayPts: player.fpts,
        projPts: player.projection,
        marketPlayer: player,
      }
    }
    const positionClass = (positionValue: string) =>
      positionValue === "G" ? "bg-sky-500 text-white" : positionValue === "D" ? "bg-amber-600 text-white" : positionValue === "C" ? "bg-blue-600 text-white" : "bg-teal-600 text-white"
    const teams = Array.from(new Set(allLeaguePlayers.map((player) => player.team))).sort()
    return <div className="p-3">
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-[#5e7090]" />
        <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search 300+ NHL players" className="w-full rounded-lg border border-[#263858] bg-[#101829] py-2 pl-9 pr-9 text-sm text-white outline-none focus:border-[#19ffff]" />
        {searchQuery.length > 0 && <button type="button" aria-label="Clear search" onClick={() => setSearchQuery("")} className="absolute right-2 top-1.5 rounded-full p-1 text-[#8ba0c7] hover:bg-[#172338] hover:text-white"><X className="size-4" /></button>}
      </div>
      <div className="mb-2 flex gap-1.5 overflow-x-auto">{["ALL", "C", "LW", "RW", "D", "G"].map((value) => <button key={value} type="button" onClick={() => setSelectedSearchPos(value)} className={cn("rounded-full px-2.5 py-1 text-[10px] font-black", selectedSearchPos === value ? "bg-[#19ffff] text-[#080c14]" : "bg-[#172338] text-[#8ba0c7]")}>{value}</button>)}{[["ALL", "All"], ["AVAILABLE", "Available Only"], ["ROSTERED", "Rostered Only"]].map(([value, label]) => <button key={value} type="button" onClick={() => setSearchOwnerFilter(value)} className={cn("rounded-full px-2.5 py-1 text-[10px] font-black", searchOwnerFilter === value ? "bg-[#19ffff] text-[#080c14]" : "bg-[#172338] text-[#8ba0c7]")}>{label}</button>)}</div>
      <select aria-label="Filter by NHL team" value={searchTeamFilter} onChange={(event) => setSearchTeamFilter(event.target.value)} className="mb-3 w-full rounded-lg border border-[#263858] bg-[#101829] px-3 py-2 text-xs text-white outline-none"><option value="ALL">All NHL teams</option>{teams.map((team) => <option key={team} value={team}>{team}</option>)}</select>
      {searchQuery.length > 0 && filteredSearchResults.length === 0 ? <div className="rounded-lg border border-[#172338] bg-[#0d1424] px-4 py-10 text-center text-sm text-[#8ba0c7]">No players found matching '{searchQuery}'</div> : <div className="rounded-lg border border-[#172338] bg-[#0d1424]">{filteredSearchResults.map((player) => {
        const available = player.owner === "FA" || player.owner.startsWith("W")
        const points = horizonMode === "projections"
          ? ("projPts" in player ? player.projPts : player.projection)
          : Number("stats" in player && player.stats && "fpts" in player.stats ? player.stats.fpts : "fpts" in player ? player.fpts : player.todayPts ?? 0)
        return <button type="button" key={player.id} onClick={() => onSelect(toTarget(player))} className="flex w-full items-center gap-2.5 border-b border-[#172338] px-3 py-2.5 text-left transition-colors hover:bg-[#0f1828]/80">
          <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-md text-[10px] font-black", positionClass(player.position))}>{player.position}</span>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1b2842]">🏒</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-xs font-black text-white">{player.name}</span><span className="block truncate text-[10px] text-[#5e7090]">{player.team} · {"opponent" in player ? player.opponent : "vs BOS"}</span></span>
          <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[9px] font-black", available ? player.owner.startsWith("W") ? "bg-amber-400/15 text-amber-300" : "bg-emerald-400/15 text-emerald-300" : "text-[#8ba0c7]")}>{available ? player.owner : player.owner}</span>
          <span className="w-10 text-right text-xs font-black tabular-nums text-[#19ffff]">{points.toFixed(1)}</span>
        </button>
      })}</div>}
    </div>
  }
  if (tab === "trend") {
    const list = trendTab === "adds"
      ? timeframe === "24 HR" ? trendingData.adds_24h : trendingData.adds_7d
      : timeframe === "24 HR" ? trendingData.drops_24h : trendingData.drops_7d
    return <div className="p-3"><div className="mb-3 flex items-center gap-2"><div className="flex gap-2"><button type="button" onClick={() => setTrendTab("adds")} className={cn("rounded-full px-3 py-1.5 text-xs font-black", trendTab === "adds" ? "bg-emerald-400 text-[#080c14]" : "bg-[#172338] text-[#8ba0c7]")}>+ Most Added</button><button type="button" onClick={() => setTrendTab("drops")} className={cn("rounded-full px-3 py-1.5 text-xs font-black", trendTab === "drops" ? "bg-[#ff2a85] text-white" : "bg-[#172338] text-[#8ba0c7]")}>- Most Dropped</button></div><div className="ml-auto flex gap-1"><button type="button" onClick={() => setTimeframe("24 HR")} className={cn("rounded-full px-2 py-1 text-[9px] font-black", timeframe === "24 HR" ? "bg-[#19ffff] text-[#080c14]" : "bg-[#172338] text-[#5e7090]")}>24 HR</button><button type="button" onClick={() => setTimeframe("7 DAYS")} className={cn("rounded-full px-2 py-1 text-[9px] font-black", timeframe === "7 DAYS" ? "bg-[#19ffff] text-[#080c14]" : "bg-[#172338] text-[#5e7090]")}>7 DAYS</button></div></div>{isLoading ? <div className="rounded-lg border border-[#172338] bg-[#0d1424] px-4 py-10 text-center text-sm text-[#8ba0c7]">Loading Yahoo trend data...</div> : list.length === 0 ? <div className="rounded-lg border border-[#172338] bg-[#0d1424] px-4 py-10 text-center text-sm text-[#8ba0c7]">Trending data is temporarily unavailable.</div> : list.slice(0, 50).map((player, index) => <TrendPlayerRow key={`${player.name}-${player.team}`} player={player} onSelect={onSelect} onClaim={trendTab === "adds" ? onClaim : undefined} rank={index + 1} />)}</div>
  }
  if (tab === "leaders") {
    const toTarget = (player: SearchPlayer): PlayerDialogTarget => {
      if ("slot" in player) return player
      return { name: player.name, position: player.position, team: player.team, opponent: "vs BOS", status: null, todayPts: player.fpts, projPts: player.projection, marketPlayer: player }
    }
    const positionClass = (positionValue: string) =>
      positionValue === "G" ? "bg-sky-500 text-white" : positionValue === "D" ? "bg-amber-600 text-white" : positionValue === "C" ? "bg-blue-600 text-white" : "bg-teal-600 text-white"
    return <div className="p-3">
      <div className="mb-2 flex gap-1.5 overflow-x-auto">
        {(["ALL", "C", "W", "D", "G"] as const).map((position) => <button key={position} type="button" onClick={() => selectLeaderPosition(position)} className={cn("h-7 cursor-pointer rounded-full px-3 text-xs font-black transition-all active:scale-95", leaderPosFilter === position ? "bg-[#19ffff] text-[#080c14] shadow-[0_0_8px_rgba(25,255,255,0.3)]" : "border border-[#1b2842] bg-[#101829] text-[#8ba0c7] hover:bg-[#16233b] hover:text-white")}>{position}</button>)}
      </div>
      <div className="mb-3 flex gap-1.5 overflow-x-auto">{leaderCategories.map((category) => <button key={category} type="button" onClick={() => selectLeaderCategory(category)} className={cn("rounded-full px-2.5 py-1 text-[10px] font-black", leaderCategory === category ? "bg-[#19ffff] text-[#080c14]" : "border border-[#1b2842] bg-[#101829] text-[#8ba0c7]")}>{category}</button>)}</div>
      <div className="rounded-lg border border-[#172338] bg-[#0d1424]">{sortedLeaders.slice(0, 50).map(({ player, displayValue, rank }) => <button type="button" key={player.id} onClick={() => onSelect(toTarget(player))} className="flex w-full items-center gap-2.5 border-b border-[#172338] px-3 py-2.5 text-left transition-colors hover:bg-[#0f1828]/80"><span className={cn("w-5 text-center text-xs font-black", rank === 1 ? "text-yellow-300" : rank === 2 ? "text-slate-300" : rank === 3 ? "text-amber-600" : "text-[#5e7090]")}>#{rank}</span><span className={cn("flex size-7 shrink-0 items-center justify-center rounded-md text-[9px] font-black", positionClass(player.position))}>{player.position}</span><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1b2842]">🏒</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-black text-white">{player.name}</span><span className="block truncate text-[10px] text-[#5e7090]">{player.team} · {player.owner}</span></span><span className="text-right text-sm font-black tabular-nums text-cyan-400">{displayValue}<small className="ml-1 text-[9px] text-[#5e7090]">{leaderCategory === "FPTS" && leaderMode === "per_game" ? "FPTS/G" : leaderCategory}</small></span></button>)}</div>
    </div>
  }
  const tradeBlockPlayers = tradeBlock.map((entry) => {
    const player = entry.teamName === "Montreal Monarchs" ? roster.find((item) => item.id === entry.playerId) : allRosters.flatMap((team) => team.players).find((item) => item.id === entry.playerId)
    return player ? { player, entry } : null
  }).filter((item): item is { player: Player; entry: TradeBlockEntry } => item !== null)
  const displayedTrades = tradeOffers.filter((trade) => activeTradeFilter === "ALL" || trade.status === activeTradeFilter)
  return <div className="space-y-4 p-3"><section><div className="mb-2"><h2 className="text-sm font-black uppercase tracking-wide text-white">Trade Block</h2></div><div className="flex gap-2 overflow-x-auto pb-1">{tradeBlockPlayers.map(({ player, entry }) => <button type="button" key={player.id} onClick={() => onSelect({ ...player, owned: entry.teamName === "Montreal Monarchs", playerId: player.id, ownerName: entry.teamName, tradeBlockNote: entry.note })} className="min-w-[170px] rounded-xl border border-[#172338] bg-[#101829] p-3 text-left"><div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-full bg-[#1b2842]">🏒</span><span className={cn("rounded px-1.5 py-0.5 text-[9px] font-black", player.position === "G" ? "bg-sky-500 text-white" : player.position === "D" ? "bg-amber-600 text-white" : player.position === "C" ? "bg-blue-600 text-white" : "bg-teal-600 text-white")}>{player.position === "LW" || player.position === "RW" ? "W" : player.position}</span></div><p className="mt-2 truncate text-xs font-black text-white">{player.name}</p><p className="truncate text-[10px] text-[#8ba0c7]">{entry.teamName}</p><p className="mt-2 line-clamp-2 text-[10px] text-[#5e7090]">{entry.note ?? "Open to offers"}</p></button>)}</div></section><section className="rounded-xl border border-[#19ffff]/30 bg-[#101a2b] p-4"><p className="text-[10px] font-black uppercase text-[#19ffff]">Propose a Trade</p><p className="mt-1 text-xs text-[#8ba0c7]">Build a multi-team offer with players, draft picks, and FAAB.</p><button type="button" onClick={onOpenTradeBuilder} className="mt-3 w-full rounded-full bg-[#19ffff] py-2.5 text-xs font-black text-[#080c14]">Open Trade Builder</button></section><section><div className="mb-2 flex items-center justify-between"><h3 className="text-[10px] font-black uppercase tracking-wider text-[#5e7090]">Trade History & Active Offers</h3><div className="flex gap-1">{(["ALL", "ACTIVE", "ACCEPTED", "REJECTED"] as const).map((filter) => <button type="button" key={filter} onClick={() => setActiveTradeFilter(filter)} className={cn("rounded-full px-2 py-1 text-[8px] font-black", activeTradeFilter === filter ? "bg-[#19ffff] text-[#080c14]" : "bg-[#172338] text-[#8ba0c7]")}>{filter}</button>)}</div></div><div className="space-y-2">{displayedTrades.length ? displayedTrades.map((trade) => <div key={trade.id} className="rounded-xl border border-[#172338] bg-[#101829] p-3"><div className="flex items-start gap-2"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1b2842]">🏒</span><div className="min-w-0 flex-1"><p className="text-xs font-black text-white">{trade.senderName} offered {trade.sendingAssets.players.map((player) => player.name).join(", ") || "assets"} for {trade.receivingAssets.players.map((player) => player.name).join(", ") || "assets"}</p><p className="mt-1 text-[10px] text-[#8ba0c7]">You send {trade.isIncoming ? trade.receivingAssets.players.map((player) => player.name).join(", ") : trade.sendingAssets.players.map((player) => player.name).join(", ")} · You receive {trade.isIncoming ? trade.sendingAssets.players.map((player) => player.name).join(", ") : trade.receivingAssets.players.map((player) => player.name).join(", ")}</p><p className="mt-1 text-[9px] text-[#5e7090]">{trade.timestamp}</p></div><span className={cn("rounded px-1.5 py-1 text-[8px] font-black", trade.status === "ACTIVE" ? "bg-amber-300/15 text-amber-200" : trade.status === "ACCEPTED" ? "bg-emerald-300/15 text-emerald-200" : "bg-rose-300/15 text-rose-200")}>{trade.status}</span></div>{trade.status === "ACTIVE" && <div className="mt-3 flex gap-2"><button type="button" onClick={() => onAcceptTrade(trade.id)} className="flex-1 rounded-full bg-emerald-400 py-1.5 text-[9px] font-black text-[#080c14]">ACCEPT</button><button type="button" onClick={() => onDeclineTrade(trade.id)} className="flex-1 rounded-full bg-rose-400 py-1.5 text-[9px] font-black text-[#080c14]">DECLINE</button><button type="button" onClick={() => onCounterTrade(trade)} className="flex-1 rounded-full border border-[#19ffff] py-1.5 text-[9px] font-black text-[#19ffff]">COUNTER</button></div>}</div>) : <p className="rounded-xl border border-dashed border-[#263858] p-6 text-center text-xs italic text-[#5e7090]">No {activeTradeFilter.toLowerCase()} trade offers.</p>}</div></section></div>
}

function LeagueStandingsView({ week, teamName }: { week: number; teamName: string }) {
  return (
    <div className="flex flex-col pb-6">
      <div className="border-b border-[#111929] px-3.5 py-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-black text-white">Matchups</h2>
          <span className="text-[10px] font-bold uppercase text-[#5e7090]">Week {week}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weekMatchups.map((matchup) => {
            const homeProjection = matchup.homeScore + 12
            const awayProjection = matchup.awayScore + 8
            const homeWin = Math.round((homeProjection / Math.max(homeProjection + awayProjection, 1)) * 100)
            return (
              <div key={matchup.id} className="min-w-[174px] rounded-lg border border-[#172338] bg-[#0d1424] p-2.5">
                <div className="flex items-center justify-between gap-2 text-[9px] font-bold text-white">
                  <span className="truncate">{matchup.homeTeam}</span>
                  <span className="text-[#5e7090]">VS</span>
                  <span className="truncate text-right">{matchup.awayTeam}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm font-black tabular-nums text-white">
                  <span>{matchup.homeScore.toFixed(1)}</span>
                  <span>{matchup.awayScore.toFixed(1)}</span>
                </div>
                <div className="mt-2 flex h-1 overflow-hidden rounded-full bg-[#ff2a85]">
                  <div className="bg-[#19ffff]" style={{ width: `${homeWin}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-[8px] font-black tabular-nums">
                  <span className="text-[#19ffff]">{homeWin}%</span>
                  <span className="text-[#ff2a85]">{100 - homeWin}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#111929]">
        <h2 className="text-sm font-black text-white">Standings Details <span className="text-[#19ffff]">&gt;</span></h2>
        <button type="button" className="rounded-full border border-[#263858] bg-[#172338] px-2.5 py-1 text-[10px] font-black text-[#aeb4ff]">🏆 PLAYOFF</button>
      </div>

      <div className="grid grid-cols-[36px_1fr_58px_58px_58px] border-b border-[#111929] px-3.5 py-2 text-[9px] font-black uppercase text-[#5e7090]">
        <span>Rank</span><span>Name</span><span className="text-right">Waiver</span><span className="text-right">PF</span><span className="text-right">PA</span>
      </div>

      {standings.map((row) => (
        <div key={row.team} className={cn("grid grid-cols-[36px_1fr_58px_58px_58px] items-center border-b border-[#111929] px-3.5 py-2.5", row.owner === "You" && "border-l-2 border-l-[#19ffff] bg-[#0c2231]")}>
          <div className="flex flex-col">
            <span className="text-xs font-black text-white">{row.rank}</span>
            {row.delta && <span className={cn("text-[9px] font-bold", row.delta.startsWith("+") ? "text-emerald-400" : "text-[#ff2a85]")}>{row.delta}</span>}
          </div>
          <div className="min-w-0 pr-1">
            <p className={cn("flex items-center gap-1 truncate text-xs font-bold", row.owner === "You" ? "text-[#19ffff]" : "text-white")}>
              {row.owner === "You" ? teamName : row.team}
              {row.owner === "You" && <Flame className="size-3 fill-orange-400 text-orange-400" />}
            </p>
            <p className="text-[10px] text-[#5e7090] truncate">{row.owner} · {row.wins}-{row.losses}</p>
          </div>
          <span className="text-right text-xs font-bold text-[#8ba0c7]">${row.faabRemaining}</span>
          <span className="text-right text-xs font-bold text-white tabular-nums">{row.pointsFor.toFixed(1)}</span>
          <span className="text-right text-xs font-bold text-[#5e7090] tabular-nums">{row.pointsAgainst.toFixed(1)}</span>
        </div>
      ))}

      <div className="px-3.5 pt-5 pb-2"><h3 className="text-sm font-black text-white">Activity Feed</h3></div>
      <div className="flex flex-col gap-2 px-3.5">
        {activities.map((act) => (
          <div key={act.id} className="rounded-lg border border-[#172338] bg-[#0d1424] px-3 py-2.5">
            <p className="text-[10px] font-bold text-white">{act.owner}<span className="ml-2 font-normal text-[#5e7090]">FREE AGENCY · {act.time}</span></p>
            <p className="mt-1 text-xs text-white">
              <span className={cn("mr-2 font-black", act.action === "ADD" ? "text-[#19ffff]" : "text-[#ff2a85]")}>{act.action === "ADD" ? "+ ADD" : "- DROP"}</span>
              {act.player} <span className="text-[#5e7090]">({act.detail})</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}