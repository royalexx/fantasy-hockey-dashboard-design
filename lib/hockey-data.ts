export type PlayerStatus = "IR" | "TAXI" | "O" | "DTD" | null

export interface Player {
  id: string
  name: string
  position: "C" | "LW" | "RW" | "D" | "G"
  slot: "C" | "LW" | "RW" | "D" | "G" | "BN" | "TAXI" | "IR"
  team: string
  opponent: string
  gameTime: string
  status: PlayerStatus
  todayPts: number | null
  projPts: number
  gamesPlayed?: number
}

export const league = {
  name: "Dynasty Puck League 2026",
  week: 8,
}

export interface MatchupSummary {
  id: string
  homeTeam: string
  homeOwner: string
  homeRecord: string
  homeScore: number
  awayTeam: string
  awayOwner: string
  awayRecord: string
  awayScore: number
  status: string
  minutesRemaining: number
  totalMinutes: number
}

export const weekMatchups: MatchupSummary[] = [
  {
    id: "m1",
    homeTeam: "Montreal Monarchs",
    homeOwner: "You",
    homeRecord: "6-2",
    homeScore: 142.5,
    awayTeam: "Toronto Titans",
    awayOwner: "Jordan",
    awayRecord: "5-3",
    awayScore: 138.0,
    status: "In Progress",
    minutesRemaining: 47,
    totalMinutes: 180,
  },
  {
    id: "m2",
    homeTeam: "Vancouver Voyagers",
    homeOwner: "Alex R.",
    homeRecord: "6-2",
    homeScore: 128.6,
    awayTeam: "Calgary Comets",
    awayOwner: "Casey",
    awayRecord: "4-4",
    awayScore: 131.2,
    status: "In Progress",
    minutesRemaining: 62,
    totalMinutes: 180,
  },
  {
    id: "m3",
    homeTeam: "Ottawa Outlaws",
    homeOwner: "Priya",
    homeRecord: "3-5",
    homeScore: 96.4,
    awayTeam: "Edmonton Ember",
    awayOwner: "Sam",
    awayRecord: "2-6",
    awayScore: 103.8,
    status: "Final",
    minutesRemaining: 0,
    totalMinutes: 180,
  },
]

export const draftPicks = ["2027 1st", "2027 2nd", "2028 1st"]

export const roster: Player[] = [
  {
    id: "p1",
    name: "Nathan MacKinnon",
    position: "C",
    slot: "C",
    team: "COL",
    opponent: "vs BOS",
    gameTime: "7:00 PM",
    status: null,
    todayPts: 18.4,
    projPts: 22.1,
  },
  {
    id: "p2",
    name: "Artemi Panarin",
    position: "LW",
    slot: "LW",
    team: "NYR",
    opponent: "@ NJD",
    gameTime: "7:30 PM",
    status: null,
    todayPts: 9.2,
    projPts: 17.5,
  },
  {
    id: "p3",
    name: "David Pastrnak",
    position: "RW",
    slot: "RW",
    team: "BOS",
    opponent: "@ COL",
    gameTime: "7:00 PM",
    status: "DTD",
    todayPts: null,
    projPts: 19.8,
  },
  {
    id: "p4",
    name: "Cale Makar",
    position: "D",
    slot: "D",
    team: "COL",
    opponent: "vs BOS",
    gameTime: "7:00 PM",
    status: null,
    todayPts: 14.1,
    projPts: 18.9,
  },
  {
    id: "p5",
    name: "Quinn Hughes",
    position: "D",
    slot: "D",
    team: "VAN",
    opponent: "vs SEA",
    gameTime: "10:00 PM",
    status: null,
    todayPts: null,
    projPts: 16.2,
  },
  {
    id: "p6",
    name: "Igor Shesterkin",
    position: "G",
    slot: "G",
    team: "NYR",
    opponent: "@ NJD",
    gameTime: "7:30 PM",
    status: null,
    todayPts: 11.0,
    projPts: 14.4,
  },
  {
    id: "p7",
    name: "Tim Stützle",
    position: "LW",
    slot: "BN",
    team: "OTT",
    opponent: "vs BUF",
    gameTime: "7:00 PM",
    status: null,
    todayPts: null,
    projPts: 15.7,
  },
  {
    id: "p8",
    name: "Trevor Zegras",
    position: "C",
    slot: "BN",
    team: "ANA",
    opponent: "@ LAK",
    gameTime: "10:00 PM",
    status: "O",
    todayPts: null,
    projPts: 0,
  },
  {
    id: "p9",
    name: "Owen Power",
    position: "D",
    slot: "BN",
    team: "BUF",
    opponent: "@ OTT",
    gameTime: "7:00 PM",
    status: null,
    todayPts: null,
    projPts: 12.3,
  },
  {
    id: "p10",
    name: "Connor Bedard",
    position: "C",
    slot: "TAXI",
    team: "CHI",
    opponent: "vs DAL",
    gameTime: "8:00 PM",
    status: "TAXI",
    todayPts: null,
    projPts: 16.8,
    gamesPlayed: 62,
  },
  {
    id: "p11",
    name: "Matvei Michkov",
    position: "RW",
    slot: "TAXI",
    team: "PHI",
    opponent: "vs PIT",
    gameTime: "7:00 PM",
    status: "TAXI",
    todayPts: null,
    projPts: 14.2,
    gamesPlayed: 55,
  },
  {
    id: "p12",
    name: "Shane Pinto",
    position: "C",
    slot: "IR",
    team: "OTT",
    opponent: "vs BUF",
    gameTime: "7:00 PM",
    status: "IR",
    todayPts: null,
    projPts: 0,
  },
]

export interface StandingRow {
  rank: number
  team: string
  owner: string
  wins: number
  losses: number
  pointsFor: number
}

export const standings: StandingRow[] = [
  { rank: 1, team: "Montreal Monarchs", owner: "You", wins: 6, losses: 2, pointsFor: 1084.4 },
  { rank: 2, team: "Vancouver Voyagers", owner: "Alex R.", wins: 6, losses: 2, pointsFor: 1061.2 },
  { rank: 3, team: "Toronto Titans", owner: "Jordan", wins: 5, losses: 3, pointsFor: 1032.9 },
  { rank: 4, team: "Calgary Comets", owner: "Casey", wins: 4, losses: 4, pointsFor: 998.6 },
  { rank: 5, team: "Ottawa Outlaws", owner: "Priya", wins: 3, losses: 5, pointsFor: 954.1 },
  { rank: 6, team: "Edmonton Ember", owner: "Sam", wins: 2, losses: 6, pointsFor: 902.3 },
]

export interface MatchupPlayer {
  name: string
  position: Player["position"]
  team: string
  opponent: string
  status: PlayerStatus
  todayPts: number | null
  projPts: number
}

export interface MatchupRow {
  slot: "C" | "LW" | "RW" | "D" | "G"
  home: MatchupPlayer
  away: MatchupPlayer
}

export const matchupStartersByMatchup: Record<string, MatchupRow[]> = {
  m1: [
    {
      slot: "C",
      home: {
        name: "Nathan MacKinnon",
        position: "C",
        team: "COL",
        opponent: "vs BOS",
        status: null,
        todayPts: 18.4,
        projPts: 22.1,
      },
      away: {
        name: "Auston Matthews",
        position: "C",
        team: "TOR",
        opponent: "@ OTT",
        status: null,
        todayPts: 16.7,
        projPts: 20.4,
      },
    },
    {
      slot: "LW",
      home: {
        name: "Artemi Panarin",
        position: "LW",
        team: "NYR",
        opponent: "@ NJD",
        status: null,
        todayPts: 9.2,
        projPts: 17.5,
      },
      away: {
        name: "Matthew Knies",
        position: "LW",
        team: "TOR",
        opponent: "@ OTT",
        status: null,
        todayPts: 8.6,
        projPts: 14.9,
      },
    },
    {
      slot: "RW",
      home: {
        name: "David Pastrnak",
        position: "RW",
        team: "BOS",
        opponent: "@ COL",
        status: "DTD",
        todayPts: null,
        projPts: 19.8,
      },
      away: {
        name: "Mitch Marner",
        position: "RW",
        team: "TOR",
        opponent: "@ OTT",
        status: null,
        todayPts: 13.2,
        projPts: 18.1,
      },
    },
    {
      slot: "D",
      home: {
        name: "Cale Makar",
        position: "D",
        team: "COL",
        opponent: "vs BOS",
        status: null,
        todayPts: 14.1,
        projPts: 18.9,
      },
      away: {
        name: "Morgan Rielly",
        position: "D",
        team: "TOR",
        opponent: "@ OTT",
        status: null,
        todayPts: 7.8,
        projPts: 12.6,
      },
    },
    {
      slot: "D",
      home: {
        name: "Quinn Hughes",
        position: "D",
        team: "VAN",
        opponent: "vs SEA",
        status: null,
        todayPts: null,
        projPts: 16.2,
      },
      away: {
        name: "Cale Fleury",
        position: "D",
        team: "TOR",
        opponent: "@ OTT",
        status: null,
        todayPts: null,
        projPts: 9.4,
      },
    },
    {
      slot: "G",
      home: {
        name: "Igor Shesterkin",
        position: "G",
        team: "NYR",
        opponent: "@ NJD",
        status: null,
        todayPts: 11.0,
        projPts: 14.4,
      },
      away: {
        name: "William Nylander",
        position: "G",
        team: "TOR",
        opponent: "@ OTT",
        status: null,
        todayPts: 10.5,
        projPts: 13.7,
      },
    },
  ],
  m2: [
    {
      slot: "C",
      home: { name: "Elias Pettersson", position: "C", team: "VAN", opponent: "vs SEA", status: null, todayPts: 15.6, projPts: 19.2 },
      away: { name: "Nazem Kadri", position: "C", team: "CGY", opponent: "@ VAN", status: null, todayPts: 12.4, projPts: 15.8 },
    },
    {
      slot: "LW",
      home: { name: "Brock Boeser", position: "LW", team: "VAN", opponent: "vs SEA", status: null, todayPts: 10.1, projPts: 14.3 },
      away: { name: "Jonathan Huberdeau", position: "LW", team: "CGY", opponent: "@ VAN", status: "DTD", todayPts: null, projPts: 16.1 },
    },
    {
      slot: "RW",
      home: { name: "Conor Garland", position: "RW", team: "VAN", opponent: "vs SEA", status: null, todayPts: 6.8, projPts: 11.5 },
      away: { name: "Andrei Kuzmenko", position: "RW", team: "CGY", opponent: "@ VAN", status: null, todayPts: 14.0, projPts: 13.7 },
    },
    {
      slot: "D",
      home: { name: "Quinn Hughes", position: "D", team: "VAN", opponent: "vs SEA", status: null, todayPts: null, projPts: 16.2 },
      away: { name: "Rasmus Andersson", position: "D", team: "CGY", opponent: "@ VAN", status: null, todayPts: 9.9, projPts: 13.4 },
    },
    {
      slot: "D",
      home: { name: "Filip Hronek", position: "D", team: "VAN", opponent: "vs SEA", status: null, todayPts: 8.2, projPts: 12.0 },
      away: { name: "MacKenzie Weegar", position: "D", team: "CGY", opponent: "@ VAN", status: null, todayPts: 11.3, projPts: 13.9 },
    },
    {
      slot: "G",
      home: { name: "Thatcher Demko", position: "G", team: "VAN", opponent: "vs SEA", status: null, todayPts: 9.5, projPts: 13.1 },
      away: { name: "Jacob Markstrom", position: "G", team: "CGY", opponent: "@ VAN", status: null, todayPts: 12.8, projPts: 12.9 },
    },
  ],
  m3: [
    {
      slot: "C",
      home: { name: "Tim Stützle", position: "C", team: "OTT", opponent: "vs EDM", status: null, todayPts: 13.2, projPts: 17.4 },
      away: { name: "Connor McDavid", position: "C", team: "EDM", opponent: "@ OTT", status: null, todayPts: 21.6, projPts: 24.0 },
    },
    {
      slot: "LW",
      home: { name: "Brady Tkachuk", position: "LW", team: "OTT", opponent: "vs EDM", status: null, todayPts: 11.4, projPts: 16.0 },
      away: { name: "Zach Hyman", position: "LW", team: "EDM", opponent: "@ OTT", status: null, todayPts: 12.1, projPts: 15.3 },
    },
    {
      slot: "RW",
      home: { name: "Claude Giroux", position: "RW", team: "OTT", opponent: "vs EDM", status: null, todayPts: 7.5, projPts: 12.8 },
      away: { name: "Leon Draisaitl", position: "RW", team: "EDM", opponent: "@ OTT", status: null, todayPts: 17.9, projPts: 20.6 },
    },
    {
      slot: "D",
      home: { name: "Jake Sanderson", position: "D", team: "OTT", opponent: "vs EDM", status: null, todayPts: 9.0, projPts: 13.5 },
      away: { name: "Evan Bouchard", position: "D", team: "EDM", opponent: "@ OTT", status: null, todayPts: 10.7, projPts: 14.9 },
    },
    {
      slot: "D",
      home: { name: "Thomas Chabot", position: "D", team: "OTT", opponent: "vs EDM", status: "O", todayPts: null, projPts: 0 },
      away: { name: "Mattias Ekholm", position: "D", team: "EDM", opponent: "@ OTT", status: null, todayPts: 6.9, projPts: 11.2 },
    },
    {
      slot: "G",
      home: { name: "Linus Ullmark", position: "G", team: "OTT", opponent: "vs EDM", status: null, todayPts: 7.8, projPts: 12.0 },
      away: { name: "Stuart Skinner", position: "G", team: "EDM", opponent: "@ OTT", status: null, todayPts: 13.6, projPts: 13.4 },
    },
  ],
}

// ---------- Player detail (deep-dive popup) ----------

function hashString(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const OPPONENT_POOL = ["BOS", "TOR", "NYR", "COL", "EDM", "VAN", "CGY", "OTT", "BUF", "DET", "FLA", "TBL", "CAR", "NJD"]

const FILLER_FORWARDS = [
  "J. Marchetti", "K. Olander", "T. Rousseau", "D. Whitfield", "M. Larkin",
  "S. Beaupre", "R. Novak", "C. Fontaine", "A. Kessler", "L. Girard",
]
const FILLER_DEFENSE = ["B. Holt", "P. Savard", "N. Dahlin Jr.", "E. Werenski", "G. Larsson", "T. Bouchard"]
const FILLER_GOALIES = ["M. Sorensen", "J. Villalta"]

const TRANSACTION_TEMPLATES = [
  (team: string) => `Drafted by ${team} in the fantasy rookie draft.`,
  (team: string) => `Added off waivers by ${team}.`,
  (team: string) => `Claimed as a free agent by ${team}.`,
  (team: string) => `Traded to ${team} for a future draft pick.`,
  (team: string) => `Traded to ${team} in a multi-player deal.`,
]

export interface PlayerDetailBio {
  age: number
  heightWeight: string
  birthplace: string
  draft: string
  shoots: string
}

export interface GameLogEntry {
  date: string
  opp: string
  result: string
  g: number
  a: number
  pts: number
  pim: number
  sog: number
  hits: number
  blk: number
  saves: number
  shotsAgainst: number
  ga: number
  shutout: boolean
  decision: "W" | "L" | "OTL" | null
  toi: string
  fpts: number
}

export interface SeasonLine {
  season: string
  team: string
  gp: number
  g: number
  a: number
  pts: number
  pim: number
  hits: number
  blk: number
  saves: number
  ga: number
  shutouts: number
  wins: number
  fptsPerGame: number
}

export interface DepthChartSlot {
  label: string
  name: string
  isTarget: boolean
}

export interface DepthChartLine {
  line: string
  slots: DepthChartSlot[]
}

export interface TransactionEntry {
  date: string
  type: "Draft" | "Waiver" | "Trade" | "Free Agent"
  description: string
}

export interface PlayerDetail {
  bio: PlayerDetailBio
  seasonTotals: {
    g: number
    a: number
    pts: number
    pim: number
    sog: number
    hits: number
    blk: number
    saves: number
    ga: number
    shutouts: number
    wins: number
    fpts: number
    fptsPerGame: number
  }
  gameLog: GameLogEntry[]
  pastSeasons: SeasonLine[]
  depthChart: DepthChartLine[]
  transactions: TransactionEntry[]
}

interface PlayerLike {
  name: string
  position: Player["position"]
  team: string
  projPts: number
}

export function getPlayerDetail(player: PlayerLike): PlayerDetail {
  const rng = mulberry32(hashString(player.name))
  const isGoalie = player.position === "G"
  const isDefense = player.position === "D"
  const base = Math.max(player.projPts, 8)

  // Bio
  const age = 20 + Math.floor(rng() * 15)
  const heightIn = 70 + Math.floor(rng() * 8)
  const weight = 175 + Math.floor(rng() * 45)
  const draftYear = 2026 - age + 18 + Math.floor(rng() * 2)
  const draftRound = 1 + Math.floor(rng() * 6)
  const draftPick = 1 + Math.floor(rng() * 31)
  const provinces = ["Ontario, CAN", "Quebec, CAN", "British Columbia, CAN", "Alberta, CAN", "Sweden", "Finland", "Czech Republic", "Michigan, USA", "Minnesota, USA"]
  const bio: PlayerDetailBio = {
    age,
    heightWeight: `${Math.floor(heightIn / 12)}'${heightIn % 12}" · ${weight} lbs`,
    birthplace: provinces[Math.floor(rng() * provinces.length)],
    draft: `${draftYear} · Round ${draftRound}, Pick ${draftPick}`,
    shoots: rng() > 0.5 ? "Left" : "Right",
  }

  // Season totals derived from a per-game fantasy rate
  const gp = 58 + Math.floor(rng() * 20)
  const fptsPerGame = base * (0.85 + rng() * 0.3)
  const fpts = Math.round(fptsPerGame * gp * 10) / 10
  let g = 0
  let a = 0
  let sog = 0
  let hits = 0
  let blk = 0
  let saves = 0
  let ga = 0
  let shutouts = 0
  let wins = 0
  if (isGoalie) {
    sog = 0
    g = 0
    a = Math.floor(rng() * 3)
    hits = 0
    blk = 0
    const savePct = 0.895 + rng() * 0.045
    const shotsAgainstPerGame = 27 + rng() * 6
    saves = Math.round(gp * shotsAgainstPerGame * savePct)
    ga = Math.round(gp * shotsAgainstPerGame * (1 - savePct))
    wins = Math.round(gp * (0.42 + rng() * 0.2))
    shutouts = Math.round(gp * (0.03 + rng() * 0.06))
  } else {
    const goalRate = isDefense ? 0.08 + rng() * 0.1 : 0.15 + rng() * 0.25
    const assistRate = isDefense ? 0.2 + rng() * 0.2 : 0.2 + rng() * 0.25
    g = Math.round(gp * goalRate)
    a = Math.round(gp * assistRate)
    sog = Math.round(g * (7 + rng() * 4))
    const hitRate = isDefense ? 1.4 + rng() * 1.2 : 0.9 + rng() * 1.1
    const blkRate = isDefense ? 1.1 + rng() * 1.0 : 0.4 + rng() * 0.5
    hits = Math.round(gp * hitRate)
    blk = Math.round(gp * blkRate)
  }
  const pts = g + a
  const pim = Math.round(gp * (0.1 + rng() * 0.35))

  // Game log — last 6 games
  const gameLog: GameLogEntry[] = Array.from({ length: 6 }).map((_, i) => {
    const dayOffset = (6 - i) * 2
    const month = 3
    const day = Math.max(1, 28 - dayOffset)
    const opp = OPPONENT_POOL[Math.floor(rng() * OPPONENT_POOL.length)]
    const home = rng() > 0.5
    const gG = isGoalie ? 0 : rng() > 0.65 ? 1 + Math.floor(rng() * 2) : 0
    const gA = isGoalie ? 0 : rng() > 0.55 ? 1 + Math.floor(rng() * 2) : 0
    const gSog = isGoalie ? 0 : 2 + Math.floor(rng() * 5)
    const gHits = isGoalie ? 0 : Math.floor(rng() * (isDefense ? 5 : 4))
    const gBlk = isGoalie ? 0 : Math.floor(rng() * (isDefense ? 4 : 2))
    const gPim = rng() > 0.8 ? 2 : 0
    const gShotsAgainst = isGoalie ? 22 + Math.floor(rng() * 18) : 0
    const gSavePct = isGoalie ? 0.86 + rng() * 0.12 : 0
    const gSaves = isGoalie ? Math.round(gShotsAgainst * gSavePct) : 0
    const gGa = isGoalie ? gShotsAgainst - gSaves : 0
    const gShutout = isGoalie && gGa === 0
    const win = isGoalie ? rng() > 0.42 : rng() > 0.45
    const decision: GameLogEntry["decision"] = isGoalie ? (win ? "W" : rng() > 0.5 ? "OTL" : "L") : null
    const toiMin = isGoalie ? 60 : 14 + Math.floor(rng() * 10)
    const toiSec = Math.floor(rng() * 60)
    const gameFpts = isGoalie
      ? Math.round((win ? 6 : 2) + gSaves * 0.2 - gGa * 1 + (gShutout ? 3 : 0))
      : Math.round((gG * 3 + gA * 2 + gSog * 0.4 + gHits * 0.3 + gBlk * 0.3 + gPim * 0.2) * 10) / 10
    return {
      date: `${month}/${day}`,
      opp: `${home ? "vs" : "@"} ${opp}`,
      result: win ? `W ${3 + Math.floor(rng() * 3)}-${1 + Math.floor(rng() * 3)}` : `L ${1 + Math.floor(rng() * 3)}-${3 + Math.floor(rng() * 3)}`,
      g: gG,
      a: gA,
      pts: gG + gA,
      pim: gPim,
      sog: gSog,
      hits: gHits,
      blk: gBlk,
      saves: gSaves,
      shotsAgainst: gShotsAgainst,
      ga: gGa,
      shutout: gShutout,
      decision,
      toi: `${toiMin}:${toiSec.toString().padStart(2, "0")}`,
      fpts: gameFpts,
    }
  })

  // Past seasons — 3 prior years, gently declining as we go back for young stars
  const seasonYears = ["2024-25", "2023-24", "2022-23"]
  const pastSeasons: SeasonLine[] = seasonYears.map((season, i) => {
    const decay = 1 - i * (0.08 + rng() * 0.06)
    const sGp = Math.max(20, Math.round(gp * (0.9 + rng() * 0.15) * (i === 2 ? 0.85 : 1)))
    const sG = Math.max(0, Math.round(g * decay * (0.85 + rng() * 0.3)))
    const sA = Math.max(0, Math.round(a * decay * (0.85 + rng() * 0.3)))
    return {
      season,
      team: player.team,
      gp: sGp,
      g: sG,
      a: sA,
      pts: sG + sA,
      pim: Math.max(0, Math.round(pim * decay * (0.8 + rng() * 0.4))),
      hits: Math.max(0, Math.round(hits * decay * (0.85 + rng() * 0.3))),
      blk: Math.max(0, Math.round(blk * decay * (0.85 + rng() * 0.3))),
      saves: Math.max(0, Math.round(saves * decay * (0.9 + rng() * 0.15) * (sGp / Math.max(gp, 1)))),
      ga: Math.max(0, Math.round(ga * decay * (0.9 + rng() * 0.2) * (sGp / Math.max(gp, 1)))),
      shutouts: Math.max(0, Math.round(shutouts * decay * (0.7 + rng() * 0.5))),
      wins: Math.max(0, Math.round(wins * decay * (0.85 + rng() * 0.3) * (sGp / Math.max(gp, 1)))),
      fptsPerGame: Math.round(fptsPerGame * decay * (0.85 + rng() * 0.3) * 10) / 10,
    }
  })

  // Depth chart — build around this player's real position
  const depthChart: DepthChartLine[] = isGoalie
    ? [
        {
          line: "Goaltending",
          slots: [
            { label: "G1", name: player.name, isTarget: true },
            { label: "G2", name: FILLER_GOALIES[0], isTarget: false },
          ],
        },
      ]
    : isDefense
      ? [1, 2, 3].map((pair) => ({
          line: `Pair ${pair}`,
          slots: [
            { label: "LD", name: pair === 1 ? player.name : FILLER_DEFENSE[(pair * 2) % FILLER_DEFENSE.length], isTarget: pair === 1 },
            { label: "RD", name: pair === 2 ? player.name : FILLER_DEFENSE[(pair * 2 + 1) % FILLER_DEFENSE.length], isTarget: pair === 2 },
          ],
        }))
      : [1, 2, 3, 4].map((line) => {
          const targetSlot = Math.floor(rng() * 3)
          const labels = ["LW", "C", "RW"]
          return {
            line: `Line ${line}`,
            slots: labels.map((label, idx) => ({
              label,
              name: line === 1 && idx === targetSlot ? player.name : FILLER_FORWARDS[(line * 3 + idx) % FILLER_FORWARDS.length],
              isTarget: line === 1 && idx === targetSlot,
            })),
          }
        })
  // Guarantee the target appears somewhere even if line 1 didn't place it
  const alreadyPlaced = depthChart.some((l) => l.slots.some((s) => s.isTarget))
  if (!alreadyPlaced && depthChart.length > 0) {
    depthChart[0].slots[0] = { ...depthChart[0].slots[0], name: player.name, isTarget: true }
  }

  // Transactions
  const teamPool = ["Montreal Monarchs", "Toronto Titans", "Vancouver Voyagers", "Calgary Comets", "Ottawa Outlaws", "Edmonton Ember"]
  const txCount = 2 + Math.floor(rng() * 2)
  const transactions: TransactionEntry[] = Array.from({ length: txCount }).map((_, i) => {
    const team = teamPool[Math.floor(rng() * teamPool.length)]
    const template = TRANSACTION_TEMPLATES[Math.floor(rng() * TRANSACTION_TEMPLATES.length)]
    const year = 2026 - i
    const types: TransactionEntry["type"][] = ["Draft", "Waiver", "Trade", "Free Agent"]
    return {
      date: `${["Jan", "Mar", "Jun", "Sep", "Oct"][Math.floor(rng() * 5)]} ${year}`,
      type: types[Math.floor(rng() * types.length)],
      description: template(team),
    }
  })

  return {
    bio,
    seasonTotals: {
      g,
      a,
      pts,
      pim,
      sog,
      hits,
      blk,
      saves,
      ga,
      shutouts,
      wins,
      fpts,
      fptsPerGame: Math.round(fptsPerGame * 10) / 10,
    },
    gameLog,
    pastSeasons,
    depthChart,
    transactions,
  }
}

export interface ChatMessage {
  id: string
  author: string
  avatarInitials: string
  message: string
  time: string
  system?: boolean
}

export const chatMessages: ChatMessage[] = [
  {
    id: "c1",
    author: "Jordan",
    avatarInitials: "JR",
    message: "Bedard is unreal, can't believe I still have him on taxi",
    time: "6:42 PM",
  },
  {
    id: "c2",
    author: "System",
    avatarInitials: "⚡",
    message: "TRADE OFFER: Team A offered 2027 1st Round Pick for Connor Bedard",
    time: "6:45 PM",
    system: true,
  },
  {
    id: "c3",
    author: "Casey",
    avatarInitials: "CS",
    message: "No shot lol, he's a generational talent",
    time: "6:46 PM",
  },
  {
    id: "c4",
    author: "Priya",
    avatarInitials: "PT",
    message: "Anyone streaming a G tonight? Shesterkin is banged up",
    time: "6:51 PM",
  },
]
