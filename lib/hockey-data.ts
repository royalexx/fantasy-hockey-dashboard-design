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
