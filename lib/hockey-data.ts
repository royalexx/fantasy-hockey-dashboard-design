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

export const matchup = {
  homeTeam: "Montreal Monarchs",
  homeScore: 142.5,
  awayTeam: "Toronto Titans",
  awayScore: 138.0,
  status: "In Progress",
  minutesRemaining: 47,
  totalMinutes: 180,
}

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

export interface MatchupScorer {
  name: string
  team: string
  pts: number
}

export const matchupTopScorers = {
  home: [
    { name: "Nathan MacKinnon", team: "COL", pts: 18.4 },
    { name: "Cale Makar", team: "COL", pts: 14.1 },
    { name: "Igor Shesterkin", team: "NYR", pts: 11.0 },
  ] as MatchupScorer[],
  away: [
    { name: "Auston Matthews", team: "TOR", pts: 16.7 },
    { name: "Mitch Marner", team: "TOR", pts: 13.2 },
    { name: "William Nylander", team: "TOR", pts: 10.5 },
  ] as MatchupScorer[],
}

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

export const matchupStarters: MatchupRow[] = [
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
]

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
