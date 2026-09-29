export type PlayerStatus = "IR" | "TAXI" | "O" | "DTD" | null
export type RosterSlot = "C" | "W" | "F" | "D" | "G" | "BN" | "TAXI" | "IR"

// Official NHL CDN Player IDs for transparent headshots
export const NHL_PLAYER_IDS: Record<string, number> = {
  // Montreal Monarchs (Your Starters)
  "Nathan MacKinnon": 8477492,
  "Auston Matthews": 8479318,
  "Elias Pettersson": 8480012,
  "Jack Eichel": 8478403,
  "Leon Draisaitl": 8477934,
  "Mitch Marner": 8478483,
  "Cale Makar": 8480069,
  "Quinn Hughes": 8480800,
  "Adam Fox": 8479323,
  "Rasmus Dahlin": 8480839,
  "Miro Heiskanen": 8480036,
  "Victor Hedman": 8475167,
  "Igor Shesterkin": 8478048,
  "Andrei Vasilevskiy": 8476883,

  // Bench & Prospects
  "Tim Stützle": 8482093,
  "Trevor Zegras": 8481533,
  "Owen Power": 8482671,
  "Matvei Michkov": 8484387,
  "Lane Hutson": 8483487,
  "Connor Bedard": 8484144,
  "Macklin Celebrini": 8484801,
  "Dustin Wolf": 8481702,
  "Logan Stankoven": 8482705,
  "Will Smith": 8484148,
  "Cutter Gauthier": 8483431,
  "Rutger McGroarty": 8483466,
  "Shane Wright": 8483434,
}

export function getPlayerPhoto(name?: string): string {
  if (!name) return "/players/player-generic.png"
  return `/api/nhl/headshot?name=${encodeURIComponent(name)}`
}

export interface SkaterStats {
  gp: number
  goals: number
  assists: number
  sog: number
  hits: number
  blocks: number
  ppp?: number
  shg?: number
  gwg?: number
}

export interface GoalieStats {
  gp: number
  wins: number
  saves: number
  goalsAgainst: number
  shutouts: number
  savePct?: number
}

export function calculateSkaterFPTS(s: SkaterStats): number {
  return Number(((s.goals * 3) + (s.assists * 2) + (s.sog * 0.3) + (s.hits * 0.25) + (s.blocks * 0.35) + ((s.ppp ?? 0) * 1) + ((s.shg ?? 0) * 2) + ((s.gwg ?? 0) * 1)).toFixed(1))
}

export function calculateGoalieFPTS(g: GoalieStats): number {
  return Number(((g.wins * 4) + (g.saves * 0.2) - g.goalsAgainst + (g.shutouts * 3)).toFixed(1))
}

export function createPlayerSeasonStats(player: Pick<Player, "id" | "name" | "position">): SkaterStats | GoalieStats {
  const seed = [...player.id].reduce((total, character) => total + character.charCodeAt(0), 0)
  if (player.position === "G") {
    const gp = 17 + seed % 7
    const wins = 9 + seed % 8
    const shutouts = 2 + seed % 3
    const saves = 420 + seed % 145
    return { gp, wins, saves, goalsAgainst: Math.round(saves * 0.085), shutouts, savePct: Number((0.91 + (seed % 18) / 1000).toFixed(3)) }
  }
  const defense = player.position === "D"
  const gp = 21 + seed % 5
  const goals = (defense ? 3 : 8) + seed % (defense ? 6 : 9)
  const assists = (defense ? 14 : 12) + seed % 14
  const sog = (defense ? 40 : 50) + seed % (defense ? 31 : 46)
  const hits = (defense ? 25 : 20) + seed % 26
  const blocks = (defense ? 30 : 10) + seed % 26
  return { gp, goals, assists, sog, hits, blocks, ppp: 2 + seed % 8, shg: seed % 2, gwg: 1 + seed % 3 }
}

export function calculatePlayerFPTS(player: Pick<Player, "position" | "stats">): number {
  const stats = player.stats ?? createPlayerSeasonStats({ id: "generated", name: "Generated Player", position: player.position })
  return player.position === "G" ? calculateGoalieFPTS(stats as GoalieStats) : calculateSkaterFPTS(stats as SkaterStats)
}

export interface Player {
  id: string
  name: string
  position: "C" | "LW" | "RW" | "D" | "G"
  slot: RosterSlot
  team: string
  opponent: string
  gameTime: string
  status: PlayerStatus
  todayPts: number | null
  projPts: number
  stats?: SkaterStats | GoalieStats
  gamesPlayed?: number
  gameState?: "Pre-game" | "In Progress" | "Final"
  timeRemaining?: number
}

export interface MarketPlayer {
  rank: number
  name: string
  position: "C" | "LW" | "RW" | "D" | "G"
  team: string
  waiver: string
  velocity: string
  rostered: string
  trend: string
  fpts: number
  projection: number
  gp: number
  goals: number
  assists: number
  sog: number
  hits: number
  blocks: number
  adp: number
  wins?: number
  saves?: number
  shutouts?: number
  savePct?: number
  stats?: SkaterStats | GoalieStats
}

export interface WaiverClaim {
  id: string
  playerToAdd: MarketPlayer
  playerToDrop: Player
  bidAmount: number
  status: "pending" | "processed"
  runTime: string
}

export interface ActivityItem {
  id: string
  owner: string
  action: "ADD" | "DROP" | "TRADE"
  player: string
  detail: string
  time: string
}

export interface TradeBlockEntry {
  playerId: string
  teamName: string
  note?: string
}

export interface LeagueTradeOffer {
  id: string
  senderName: string
  senderTeam: string
  receiverName: string
  receiverTeam: string
  sendingAssets: { players: Player[]; picks?: string[]; faab?: number }
  receivingAssets: { players: Player[]; picks?: string[]; faab?: number }
  status: "ACTIVE" | "ACCEPTED" | "REJECTED"
  timestamp: string
  isIncoming: boolean
}

export const league = {
  name: "DYNASTY PUCK LEAGUE 2026",
  week: 1,
  faabBudget: 100,
  tradeBlock: [
    { playerId: "p13", teamName: "Montreal Monarchs", note: "Looking for: Top 4 D or 2027 1st" },
    { playerId: "tor-2", teamName: "Toronto Titans", note: "Looking for: young C" },
    { playerId: "cgy-17", teamName: "Calgary Comets", note: "Looking for: 2027 Round 1" },
  ] satisfies TradeBlockEntry[],
}

export const defaultFaabBudget = 100

// 20 starters: 3 C, 6 W, 3 F, 6 D, 2 G + 4 BN, 2 TAXI, 1 IR
export const roster: Player[] = [
  { id: "p1", name: "Nathan MacKinnon", position: "C", slot: "C", team: "COL", opponent: "vs BOS", gameTime: "7:00 PM", status: null, todayPts: 16.3, projPts: 18.2, stats: { gp: 24, goals: 16, assists: 25, sog: 104, hits: 22, blocks: 11, ppp: 8, gwg: 2, shg: 0 }, gameState: "In Progress", timeRemaining: 40 },
  { id: "p2", name: "Auston Matthews", position: "C", slot: "C", team: "TOR", opponent: "@ OTT", gameTime: "7:00 PM", status: null, todayPts: 16.5, projPts: 18.5, stats: { gp: 22, goals: 18, assists: 14, sog: 98, hits: 31, blocks: 24, ppp: 7, gwg: 3, shg: 0 }, gameState: "Final", timeRemaining: 0 },
  { id: "p3", name: "Jack Hughes", position: "C", slot: "C", team: "NJD", opponent: "vs NYR", gameTime: "7:00 PM", status: "DTD", todayPts: 11.5, projPts: 12.9, gameState: "Pre-game", timeRemaining: 60 },
  { id: "p4", name: "Artemi Panarin", position: "LW", slot: "W", team: "NYR", opponent: "@ NJD", gameTime: "7:00 PM", status: null, todayPts: 13.0, projPts: 14.6, gameState: "In Progress", timeRemaining: 40 },
  { id: "p5", name: "David Pastrnak", position: "RW", slot: "W", team: "BOS", opponent: "@ COL", gameTime: "7:00 PM", status: "DTD", todayPts: 13.5, projPts: 15.1, gameState: "Pre-game", timeRemaining: 60 },
  { id: "p6", name: "Kirill Kaprizov", position: "LW", slot: "W", team: "MIN", opponent: "vs DAL", gameTime: "7:00 PM", status: null, todayPts: 10.3, projPts: 11.5 },
  { id: "p7", name: "Mikko Rantanen", position: "RW", slot: "W", team: "DAL", opponent: "@ MIN", gameTime: "7:00 PM", status: null, todayPts: 11.3, projPts: 12.6 },
  { id: "p8", name: "Jason Robertson", position: "LW", slot: "W", team: "DAL", opponent: "@ MIN", gameTime: "7:00 PM", status: null, todayPts: 10.0, projPts: 11.2 },
  { id: "p9", name: "Brady Tkachuk", position: "LW", slot: "W", team: "OTT", opponent: "vs TOR", gameTime: "7:00 PM", status: null, todayPts: 10.5, projPts: 11.8 },
  { id: "p10", name: "Elias Pettersson", position: "C", slot: "F", team: "VAN", opponent: "vs SEA", gameTime: "7:00 PM", status: null, todayPts: 9.8, projPts: 10.9 },
  { id: "p11", name: "Jack Eichel", position: "C", slot: "F", team: "VGK", opponent: "vs EDM", gameTime: "7:00 PM", status: null, todayPts: 12.4, projPts: 14.1 },
  { id: "p12", name: "Leon Draisaitl", position: "C", slot: "F", team: "EDM", opponent: "@ VGK", gameTime: "7:00 PM", status: null, todayPts: 14.1, projPts: 15.8 },
  { id: "p13", name: "Cale Makar", position: "D", slot: "D", team: "COL", opponent: "vs BOS", gameTime: "7:00 PM", status: null, todayPts: 15.2, projPts: 16.4, stats: { gp: 24, goals: 9, assists: 26, sog: 74, hits: 28, blocks: 46, ppp: 9, gwg: 1, shg: 0 } },
  { id: "p14", name: "Quinn Hughes", position: "D", slot: "D", team: "VAN", opponent: "vs SEA", gameTime: "7:00 PM", status: null, todayPts: 12.8, projPts: 14.0, stats: { gp: 23, goals: 5, assists: 28, sog: 62, hits: 14, blocks: 32, ppp: 8, gwg: 1, shg: 0 } },
  { id: "p15", name: "Adam Fox", position: "D", slot: "D", team: "NYR", opponent: "@ NJD", gameTime: "7:00 PM", status: null, todayPts: 10.4, projPts: 11.9 },
  { id: "p16", name: "Rasmus Dahlin", position: "D", slot: "D", team: "BUF", opponent: "@ OTT", gameTime: "7:00 PM", status: null, todayPts: 9.6, projPts: 11.2 },
  { id: "p17", name: "Miro Heiskanen", position: "D", slot: "D", team: "DAL", opponent: "@ MIN", gameTime: "7:00 PM", status: null, todayPts: 8.9, projPts: 10.5 },
  { id: "p18", name: "Victor Hedman", position: "D", slot: "D", team: "TBL", opponent: "vs FLA", gameTime: "7:00 PM", status: null, todayPts: 9.1, projPts: 10.8 },
  { id: "p19", name: "Igor Shesterkin", position: "G", slot: "G", team: "NYR", opponent: "@ NJD", gameTime: "7:00 PM", status: null, todayPts: 14.0, projPts: 15.2, stats: { gp: 19, wins: 14, saves: 524, goalsAgainst: 40, shutouts: 3, savePct: 0.924 }, gameState: "In Progress", timeRemaining: 40 },
  { id: "p20", name: "Andrei Vasilevskiy", position: "G", slot: "G", team: "TBL", opponent: "vs FLA", gameTime: "7:00 PM", status: null, todayPts: 13.2, projPts: 14.8, stats: { gp: 20, wins: 15, saves: 510, goalsAgainst: 44, shutouts: 4, savePct: 0.921 }, gameState: "Final", timeRemaining: 0 },
  { id: "p21", name: "Tim Stützle", position: "C", slot: "BN", team: "OTT", opponent: "vs BUF", gameTime: "7:00 PM", status: null, todayPts: 0.0, projPts: 12.4 },
  { id: "p22", name: "Trevor Zegras", position: "C", slot: "BN", team: "ANA", opponent: "@ LAK", gameTime: "7:00 PM", status: "O", todayPts: 0.0, projPts: 0.0 },
  { id: "p23", name: "Owen Power", position: "D", slot: "BN", team: "BUF", opponent: "@ OTT", gameTime: "7:00 PM", status: null, todayPts: 0.0, projPts: 11.2 },
  { id: "p24", name: "Matvei Michkov", position: "RW", slot: "BN", team: "PHI", opponent: "vs PIT", gameTime: "7:00 PM", status: null, todayPts: 0.0, projPts: 13.0 },
  { id: "p25", name: "Connor Bedard", position: "C", slot: "TAXI", team: "CHI", opponent: "vs DAL", gameTime: "8:00 PM", status: "TAXI", todayPts: 0.0, projPts: 14.5, gamesPlayed: 22, stats: { gp: 22, goals: 12, assists: 17, sog: 76, hits: 18, blocks: 12, ppp: 5, gwg: 1, shg: 0 } },
  { id: "p26", name: "Macklin Celebrini", position: "C", slot: "TAXI", team: "SJS", opponent: "@ LAK", gameTime: "10:30 PM", status: "TAXI", todayPts: 0.0, projPts: 13.8, gamesPlayed: 21, stats: { gp: 21, goals: 11, assists: 15, sog: 68, hits: 19, blocks: 14, ppp: 5, gwg: 1, shg: 0 } },
  { id: "p27", name: "Lane Hutson", position: "D", slot: "IR", team: "MTL", opponent: "vs TOR", gameTime: "7:00 PM", status: "IR", todayPts: 0.0, projPts: 0.0, stats: { gp: 23, goals: 4, assists: 19, sog: 48, hits: 12, blocks: 26, ppp: 4, gwg: 1, shg: 0 } },
]

const starterSlots: Array<{ slot: Extract<RosterSlot, "C" | "W" | "F" | "D" | "G">; position: Player["position"] }> = [
  { slot: "C", position: "C" }, { slot: "C", position: "C" }, { slot: "C", position: "C" },
  { slot: "W", position: "LW" }, { slot: "W", position: "RW" }, { slot: "W", position: "LW" },
  { slot: "W", position: "RW" }, { slot: "W", position: "LW" }, { slot: "W", position: "RW" },
  { slot: "F", position: "C" }, { slot: "F", position: "C" }, { slot: "F", position: "C" },
  { slot: "D", position: "D" }, { slot: "D", position: "D" }, { slot: "D", position: "D" },
  { slot: "D", position: "D" }, { slot: "D", position: "D" }, { slot: "D", position: "D" },
  { slot: "G", position: "G" }, { slot: "G", position: "G" },
]

const teamStarterNames: Record<string, string[]> = {
  "Toronto Titans": ["John Tavares", "Auston Matthews", "Mitch Marner", "Matthew Knies", "William Nylander", "Max Domi", "Tyler Bertuzzi", "Bobby McMann", "Pontus Holmberg", "Nick Robertson", "Morgan Rielly", "Chris Tanev", "Jake McCabe", "Simon Benoit", "Conor Timmins", "Oliver Ekman-Larsson", "Joseph Woll", "Anthony Stolarz", "Easton Cowan", "David Kampf"],
  "Vancouver Voyagers": ["Elias Pettersson", "J.T. Miller", "Brock Boeser", "Conor Garland", "Jake DeBrusk", "Dakota Joshua", "Pius Suter", "Nils Hoglander", "Kiefer Sherwood", "Danton Heinen", "Quinn Hughes", "Filip Hronek", "Carson Soucy", "Tyler Myers", "Derek Forbort", "Vincent Desharnais", "Thatcher Demko", "Kevin Lankinen", "Teddy Blueger", "Arturs Silovs"],
  "Calgary Comets": ["Nazem Kadri", "Jonathan Huberdeau", "Blake Coleman", "Andrei Kuzmenko", "Yegor Sharangovich", "Connor Zary", "Martin Pospisil", "Adam Klapka", "Kevin Rooney", "Ryan Lomberg", "Rasmus Andersson", "MacKenzie Weegar", "Kevin Bahl", "Daniil Miromanov", "Jake Bean", "Oliver Kylington", "Dustin Wolf", "Dan Vladar", "Parker Bell", "Connor Murphy"],
  "Ottawa Outlaws": ["Tim Stützle", "Josh Norris", "Claude Giroux", "Brady Tkachuk", "Drake Batherson", "Parker Kelly", "Shane Pinto", "Ridly Greig", "Michael Amadio", "David Perron", "Jake Sanderson", "Thomas Chabot", "Artem Zub", "Nick Jensen", "Tyler Kleven", "Jacob Bernard-Docker", "Linus Ullmark", "Anton Forsberg", "Leevi Merilainen", "Zack Ostapchuk"],
  "Edmonton Ember": ["Connor McDavid", "Leon Draisaitl", "Ryan Nugent-Hopkins", "Zach Hyman", "Viktor Arvidsson", "Jeff Skinner", "Mattias Janmark", "Adam Henrique", "Corey Perry", "Connor Brown", "Evan Bouchard", "Mattias Ekholm", "Darnell Nurse", "Brett Kulak", "Ty Emberson", "John Klingberg", "Stuart Skinner", "Calvin Pickard", "Cody Ceci", "James Hamblin"],
  "Detroit Motors": ["Dylan Larkin", "Alex DeBrincat", "Lucas Raymond", "Patrick Kane", "J.T. Compher", "Andrew Copp", "Rasmussen", "Jonatan Berggren", "Vladimir Tarasenko", "Marco Kasper", "Moritz Seider", "Ben Chiarot", "Jeff Petry", "Simon Edvinsson", "Justin Holl", "Shayne Gostisbehere", "Alex Lyon", "Cam Talbot", "Kasperi Kapanen", "Christian Fischer"],
  "Boston Blades": ["David Pastrnak", "Brad Marchand", "Charlie Coyle", "Morgan Geekie", "Pavel Zacha", "Elias Lindholm", "Trent Frederic", "Pius Suter", "Justin Brazeau", "Max Jones", "Charlie McAvoy", "Hampus Lindholm", "Brandon Carlo", "Mason Lohrei", "Andrew Peeke", "Jordan Oesterle", "Jeremy Swayman", "Joonas Korpisalo", "Mark Kastelic", "John Beecher"],
  "Colorado Summit": ["Nathan MacKinnon", "Mikko Rantanen", "Valeri Nichushkin", "Casey Mittelstadt", "Ross Colton", "Artturi Lehkonen", "Miles Wood", "Logan O'Connor", "Joel Kiviranta", "Ivan Ivan", "Cale Makar", "Devon Toews", "Josh Manson", "Samuel Girard", "Jacob MacDonald", "Sam Malinski", "Alexandar Georgiev", "Mackenzie Blackwood", "Calvin Jones", "John Ludvig"],
  "Florida Waves": ["Aleksander Barkov", "Matthew Tkachuk", "Sam Reinhart", "Carter Verhaeghe", "Evan Rodrigues", "Sam Bennett", "Anton Lundell", "Eetu Luostarinen", "Jesper Boqvist", "Mackie Samoskevich", "Aaron Ekblad", "Gustav Forsling", "Brandon Montour", "Niko Mikkola", "Dmitry Kulikov", "Uvis Balinskis", "Sergei Bobrovsky", "Spencer Knight", "Adam Boqvist", "Jaycob Megna"],
  "Minnesota Northstars": ["Kirill Kaprizov", "Joel Eriksson Ek", "Matt Boldy", "Marco Rossi", "Ryan Hartman", "Marcus Johansson", "Marcus Foligno", "Frederick Gaudreau", "Jakub Lauko", "Liam Ohgren", "Brock Faber", "Jonas Brodin", "Jacob Middleton", "Jared Spurgeon", "Declan Chisholm", "Zach Bogosian", "Filip Gustavsson", "Marc-Andre Fleury", "Daemon Hunt", "David Jiricek"],
  "Tampa Bay Bolts": ["Brayden Point", "Nikita Kucherov", "Steven Stamkos", "Jake Guentzel", "Brandon Hagel", "Anthony Cirelli", "Nicholas Paul", "Conor Sheary", "Nick Perbix", "Gage Goncalves", "Victor Hedman", "Ryan McDonagh", "Darren Raddysh", "Erik Cernak", "Emil Lilleberg", "Max Crozier", "Andrei Vasilevskiy", "Jonas Johansson", "Mitchell Chaffee", "Luke Glendening"],
}

function createTeamRoster(teamName: string, names: string[]): Player[] {
  const teamCode = {
    "Toronto Titans": "TOR",
    "Vancouver Voyagers": "VAN",
    "Calgary Comets": "CGY",
    "Ottawa Outlaws": "OTT",
    "Edmonton Ember": "EDM",
    "Detroit Motors": "DET",
    "Boston Blades": "BOS",
    "Colorado Summit": "COL",
    "Florida Waves": "FLA",
    "Minnesota Northstars": "MIN",
    "Tampa Bay Bolts": "TBL",
  }[teamName] ?? "NHL"
  return names.map((name, index) => {
    const slotInfo = starterSlots[index]
    const todayPts = Math.round((7 + (index % 7) * 1.35) * 10) / 10
    const stats = createPlayerSeasonStats({ id: `${teamCode.toLowerCase()}-${index + 1}`, name, position: slotInfo.position })
    const seasonFpts = slotInfo.position === "G" ? calculateGoalieFPTS(stats as GoalieStats) : calculateSkaterFPTS(stats as SkaterStats)
    return {
      id: `${teamCode.toLowerCase()}-${index + 1}`,
      name,
      position: slotInfo.position,
      slot: slotInfo.slot,
      team: teamCode,
      opponent: index % 2 === 0 ? "vs MTL" : "@ MTL",
      gameTime: "7:00 PM",
      status: null,
      todayPts,
      projPts: Math.round((seasonFpts / stats.gp) * 3.5 * 10) / 10,
      stats,
      gameState: index % 3 === 0 ? "Final" : index % 3 === 1 ? "In Progress" : "Pre-game",
      timeRemaining: index % 3 === 0 ? 0 : index % 3 === 1 ? 40 : 60,
    }
  })
}

const dedicatedTeamRosters: Record<string, Player[]> = Object.fromEntries(
  Object.entries(teamStarterNames).map(([teamName, names]) => [teamName, createTeamRoster(teamName, names)]),
)

export function getTeamRoster(teamName: string, userRoster: Player[]): Player[] {
  if (teamName === "Montreal Monarchs") return userRoster
  return dedicatedTeamRosters[teamName] ?? []
}

export const marketPlayers: MarketPlayer[] = [
  { rank: 1, name: "Macklin Celebrini", position: "C", team: "SJS", waiver: "W (Wed)", velocity: "+4.1M", rostered: "62.3%", trend: "-1.7%", fpts: 162.8, projection: 18.5, gp: 21, goals: 11, assists: 15, sog: 68, hits: 19, blocks: 14, adp: 24.5 },
  { rank: 2, name: "Logan Stankoven", position: "RW", team: "DAL", waiver: "FA", velocity: "+822.8K", rostered: "74.1%", trend: "+2.4%", fpts: 134.4, projection: 16.2, gp: 22, goals: 8, assists: 13, sog: 54, hits: 16, blocks: 10, adp: 61.2 },
  { rank: 3, name: "Dustin Wolf", position: "G", team: "CGY", waiver: "W (Wed)", velocity: "+469.5K", rostered: "83.5%", trend: "+0.8%", fpts: 142.0, projection: 17.1, gp: 17, goals: 0, assists: 2, sog: 0, hits: 0, blocks: 0, adp: 88.4, wins: 10, saves: 465, shutouts: 2, savePct: 0.914 },
  { rank: 4, name: "Lane Hutson", position: "D", team: "MTL", waiver: "FA", velocity: "+459.3K", rostered: "78.2%", trend: "+3.1%", fpts: 148.2, projection: 15.8, gp: 23, goals: 4, assists: 19, sog: 48, hits: 12, blocks: 26, adp: 47.8 },
  { rank: 5, name: "Will Smith", position: "C", team: "SJS", waiver: "FA", velocity: "+380.1K", rostered: "51.4%", trend: "+1.9%", fpts: 10.6, projection: 13.5, gp: 67, goals: 17, assists: 31, sog: 132, hits: 20, blocks: 9, adp: 103.1 },
  { rank: 6, name: "Cutter Gauthier", position: "LW", team: "ANA", waiver: "FA", velocity: "+312.4K", rostered: "48.9%", trend: "+2.8%", fpts: 10.1, projection: 13.2, gp: 61, goals: 16, assists: 25, sog: 119, hits: 64, blocks: 12, adp: 111.6 },
  { rank: 7, name: "Rutger McGroarty", position: "LW", team: "PIT", waiver: "FA", velocity: "+284.6K", rostered: "42.5%", trend: "+1.4%", fpts: 8.9, projection: 12.7, gp: 58, goals: 13, assists: 24, sog: 105, hits: 71, blocks: 10, adp: 126.3 },
  { rank: 8, name: "Shane Wright", position: "C", team: "SEA", waiver: "W (Wed)", velocity: "+241.8K", rostered: "67.8%", trend: "+0.6%", fpts: 9.7, projection: 12.8, gp: 72, goals: 18, assists: 29, sog: 141, hits: 34, blocks: 11, adp: 95.7 },
  { rank: 9, name: "Yaroslav Askarov", position: "G", team: "SJS", waiver: "FA", velocity: "+219.3K", rostered: "38.2%", trend: "+4.5%", fpts: 12.2, projection: 16.4, gp: 35, goals: 0, assists: 1, sog: 0, hits: 0, blocks: 0, adp: 139.5 },
  { rank: 10, name: "Frank Nazar", position: "C", team: "CHI", waiver: "FA", velocity: "+198.7K", rostered: "35.6%", trend: "+2.1%", fpts: 8.4, projection: 11.9, gp: 54, goals: 12, assists: 22, sog: 98, hits: 18, blocks: 7, adp: 144.2 },
  { rank: 11, name: "David Jiricek", position: "D", team: "MIN", waiver: "FA", velocity: "+177.4K", rostered: "29.8%", trend: "+1.2%", fpts: 7.6, projection: 11.6, gp: 59, goals: 5, assists: 21, sog: 87, hits: 82, blocks: 52, adp: 158.7 },
  { rank: 12, name: "Egor Zamula", position: "D", team: "PHI", waiver: "FA", velocity: "+154.2K", rostered: "24.1%", trend: "+0.7%", fpts: 7.1, projection: 10.8, gp: 62, goals: 4, assists: 18, sog: 76, hits: 69, blocks: 61, adp: 171.4 },
  { rank: 13, name: "Marco Kasper", position: "C", team: "DET", waiver: "FA", velocity: "+139.8K", rostered: "31.5%", trend: "+1.0%", fpts: 8.2, projection: 11.4, gp: 57, goals: 14, assists: 20, sog: 112, hits: 88, blocks: 15, adp: 149.8 },
  { rank: 14, name: "Zach Benson", position: "LW", team: "BUF", waiver: "W (Wed)", velocity: "+118.6K", rostered: "58.7%", trend: "-0.3%", fpts: 9.0, projection: 11.7, gp: 73, goals: 15, assists: 28, sog: 128, hits: 37, blocks: 13, adp: 118.9 },
  { rank: 15, name: "Brandt Clarke", position: "D", team: "LAK", waiver: "FA", velocity: "+96.4K", rostered: "45.2%", trend: "+0.5%", fpts: 8.8, projection: 12.1, gp: 69, goals: 7, assists: 34, sog: 119, hits: 40, blocks: 44, adp: 132.6 },
  { rank: 16, name: "Connor Hellebuyck", position: "G", team: "WPG", waiver: "FA", velocity: "+84.3K", rostered: "91.2%", trend: "+0.9%", fpts: 208.5, projection: 18.1, gp: 21, goals: 0, assists: 1, sog: 0, hits: 0, blocks: 0, adp: 35.4, wins: 16, saves: 582, shutouts: 4, savePct: 0.927 },
  { rank: 17, name: "Connor McDavid", position: "C", team: "EDM", waiver: "FA", velocity: "+72.6K", rostered: "96.4%", trend: "+1.1%", fpts: 246.2, projection: 19.4, gp: 23, goals: 14, assists: 29, sog: 82, hits: 18, blocks: 8, adp: 3.2 },
]

export const activities: ActivityItem[] = [
  { id: "a1", owner: "Alex R.", action: "ADD", player: "Lane Hutson", detail: "D - MTL", time: "Today, 13:45" },
  { id: "a2", owner: "Jordan", action: "ADD", player: "Macklin Celebrini", detail: "C - SJS", time: "Yesterday, 18:20" },
  { id: "a3", owner: "Jordan", action: "DROP", player: "Max Domi", detail: "C - TOR", time: "Yesterday, 18:20" },
]

export interface PlayerNewsItem {
  player: string
  team: string
  headline: string
  analysis: string
}

export const playerNews: PlayerNewsItem[] = [
  { player: "Nathan MacKinnon", team: "COL", headline: "Nathan MacKinnon rest day on Monday", analysis: "MacKinnon is expected to return to the top line for the next game and remains an elite fantasy play." },
  { player: "Lane Hutson", team: "MTL", headline: "Lane Hutson nearing a return", analysis: "The rookie defenseman continues skating and could rejoin the lineup later this week." },
  { player: "Igor Shesterkin", team: "NYR", headline: "Shesterkin confirmed for tonight", analysis: "New York will turn to Shesterkin between the pipes in a favorable matchup." },
]

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
  totalMinutes: number
}

export const weekMatchups: MatchupSummary[] = [
  { id: "m1", homeTeam: "Montreal Monarchs", homeOwner: "You", homeRecord: "2-0", homeScore: 185.28, awayTeam: "Toronto Titans", awayOwner: "Jordan", awayRecord: "1-1", awayScore: 179.94, status: "In Progress", totalMinutes: 180 },
  { id: "m2", homeTeam: "Vancouver Voyagers", homeOwner: "Alex R.", homeRecord: "2-0", homeScore: 143.04, awayTeam: "Calgary Comets", awayOwner: "Casey", awayRecord: "0-2", awayScore: 83.8, status: "In Progress", totalMinutes: 180 },
  { id: "m3", homeTeam: "Ottawa Outlaws", homeOwner: "Priya", homeRecord: "1-1", homeScore: 173.54, awayTeam: "Edmonton Ember", awayOwner: "Sam", awayRecord: "0-2", awayScore: 136.04, status: "Final", totalMinutes: 180 },
  { id: "m4", homeTeam: "Detroit Motors", homeOwner: "Riley", homeRecord: "1-1", homeScore: 156.22, awayTeam: "Boston Blades", awayOwner: "Taylor", awayRecord: "1-1", awayScore: 151.87, status: "In Progress", totalMinutes: 180 },
  { id: "m5", homeTeam: "Colorado Summit", homeOwner: "Morgan", homeRecord: "2-0", homeScore: 192.4, awayTeam: "Florida Waves", awayOwner: "Jamie", awayRecord: "1-1", awayScore: 180.14, status: "In Progress", totalMinutes: 180 },
  { id: "m6", homeTeam: "Minnesota Northstars", homeOwner: "Chris", homeRecord: "0-2", homeScore: 129.76, awayTeam: "Tampa Bay Bolts", awayOwner: "Drew", awayRecord: "2-0", awayScore: 167.32, status: "Final", totalMinutes: 180 },
]

export interface ScheduleRow {
  week: number
  opponent: string
  opponentOwner: string
  score: string
  result: "WIN" | "LOSS" | "SCHEDULED"
}

export const teamSchedule: ScheduleRow[] = Array.from({ length: 14 }, (_, index) => ({
  week: index + 1,
  opponent: weekMatchups[index % weekMatchups.length].awayTeam,
  opponentOwner: weekMatchups[index % weekMatchups.length].awayOwner,
  score: index < 3 ? `${185 - index * 9}.28 - ${179 - index * 11}.94` : "—",
  result: index < 3 ? (index === 1 ? "LOSS" : "WIN") : "SCHEDULED",
}))

export interface MatchupPlayer {
  name: string
  position: Player["position"]
  team: string
  opponent: string
  status: PlayerStatus
  todayPts: number | null
  projPts: number
  empty?: boolean
}

export interface MatchupRow {
  slot: "C" | "LW" | "RW" | "W" | "F" | "D" | "G"
  home: MatchupPlayer
  away: MatchupPlayer
}

export const matchupStartersByMatchup: Record<string, MatchupRow[]> = {
  m1: [
    { slot: "C", home: { name: "Nathan MacKinnon", position: "C", team: "COL", opponent: "vs BOS", status: null, todayPts: 16.3, projPts: 18.2 }, away: { name: "Auston Matthews", position: "C", team: "TOR", opponent: "@ OTT", status: null, todayPts: 16.5, projPts: 18.5 } },
    { slot: "LW", home: { name: "Artemi Panarin", position: "LW", team: "NYR", opponent: "@ NJD", status: null, todayPts: 13.0, projPts: 14.6 }, away: { name: "Matthew Knies", position: "LW", team: "TOR", opponent: "@ OTT", status: null, todayPts: 8.6, projPts: 14.9 } },
    { slot: "RW", home: { name: "David Pastrnak", position: "RW", team: "BOS", opponent: "@ COL", status: "DTD", todayPts: 13.5, projPts: 15.1 }, away: { name: "Mitch Marner", position: "RW", team: "TOR", opponent: "@ OTT", status: null, todayPts: 13.2, projPts: 18.1 } },
    { slot: "D", home: { name: "Cale Makar", position: "D", team: "COL", opponent: "vs BOS", status: null, todayPts: 15.2, projPts: 16.4 }, away: { name: "Morgan Rielly", position: "D", team: "TOR", opponent: "@ OTT", status: null, todayPts: 7.8, projPts: 12.6 } },
    { slot: "D", home: { name: "Quinn Hughes", position: "D", team: "VAN", opponent: "vs SEA", status: null, todayPts: 12.8, projPts: 14.0 }, away: { name: "Cale Fleury", position: "D", team: "TOR", opponent: "@ OTT", status: null, todayPts: null, projPts: 9.4 } },
    { slot: "G", home: { name: "Igor Shesterkin", position: "G", team: "NYR", opponent: "@ NJD", status: null, todayPts: 14.0, projPts: 15.2 }, away: { name: "Joseph Woll", position: "G", team: "TOR", opponent: "@ OTT", status: null, todayPts: 10.5, projPts: 13.7 } },
  ],
  m2: [],
  m3: [],
}

export const draftPicks = ["2027 1st Rd", "2027 2nd Rd", "2028 1st Rd", "2028 2nd Rd"]

export interface StandingRow {
  rank: number
  delta: string | null
  team: string
  owner: string
  wins: number
  losses: number
  pointsFor: number
  pointsAgainst: number
  faabRemaining: number
}

export const standings: StandingRow[] = [
  { rank: 1, delta: null, team: "Montreal Monarchs", owner: "You", wins: 2, losses: 0, pointsFor: 448.24, pointsAgainst: 314.96, faabRemaining: 100 },
  { rank: 2, delta: "+3", team: "Team WisconsinVVB", owner: "@WisconsinVVB", wins: 2, losses: 0, pointsFor: 368.06, pointsAgainst: 270.3, faabRemaining: 75 },
  { rank: 3, delta: "-1", team: "Daejon Love's Team", owner: "@Melchior1", wins: 2, losses: 0, pointsFor: 360.16, pointsAgainst: 217.96, faabRemaining: 100 },
  { rank: 4, delta: "+2", team: "Toronto Titans", owner: "@danick504", wins: 1, losses: 1, pointsFor: 356.06, pointsAgainst: 318.4, faabRemaining: 100 },
  { rank: 5, delta: "+1", team: "Vancouver Voyagers", owner: "@alexr", wins: 1, losses: 1, pointsFor: 344.82, pointsAgainst: 331.44, faabRemaining: 88 },
  { rank: 6, delta: "-2", team: "Colorado Summit", owner: "@morgan", wins: 1, losses: 1, pointsFor: 338.21, pointsAgainst: 329.18, faabRemaining: 62 },
  { rank: 7, delta: null, team: "Florida Waves", owner: "@jamie", wins: 1, losses: 1, pointsFor: 326.7, pointsAgainst: 342.11, faabRemaining: 91 },
  { rank: 8, delta: null, team: "Detroit Motors", owner: "@riley", wins: 1, losses: 1, pointsFor: 319.55, pointsAgainst: 347.02, faabRemaining: 74 },
  { rank: 9, delta: "+1", team: "Boston Blades", owner: "@taylor", wins: 1, losses: 1, pointsFor: 312.64, pointsAgainst: 351.8, faabRemaining: 57 },
  { rank: 10, delta: "-1", team: "Ottawa Outlaws", owner: "@priya", wins: 1, losses: 1, pointsFor: 304.48, pointsAgainst: 365.12, faabRemaining: 43 },
  { rank: 11, delta: null, team: "Tampa Bay Bolts", owner: "@drew", wins: 0, losses: 2, pointsFor: 298.32, pointsAgainst: 374.2, faabRemaining: 29 },
  { rank: 12, delta: null, team: "Calgary Comets", owner: "@casey", wins: 0, losses: 2, pointsFor: 267.9, pointsAgainst: 389.44, faabRemaining: 16 },
]

export interface ChatMessage {
  id: string
  author: string
  message: string
  time: string
  avatarInitials: string
  system?: boolean
}

export const chatMessages: ChatMessage[] = [
  { id: "c1", author: "Jordan", avatarInitials: "JR", message: "Bedard is unreal, can't believe I still have him on taxi", time: "6:42 PM" },
  { id: "c2", author: "Casey", avatarInitials: "CS", message: "No shot lol, he's a generational talent", time: "6:46 PM" },
  { id: "c-system-1", author: "SYSTEM", avatarInitials: "⚡", message: "Alex R. claimed Lane Hutson ($14 FAAB)", time: "6:49 PM", system: true },
  { id: "c3", author: "Priya", avatarInitials: "PT", message: "Anyone streaming a G tonight? Shesterkin is banged up", time: "6:51 PM" },
]

export function getPlayerDetail(player: { name: string; position: Player["position"]; team: string; projPts: number }) {
  const forwardRole = player.position === "LW" || player.position === "RW" || player.position === "C" ? player.position : null
  const defenseRole = player.position === "D" ? "LD" : null
  const goalieRole = player.position === "G"
  return {
    bio: { age: 24, heightWeight: "6'1\" · 195 lbs", birthplace: "Canada", draft: "Round 1, Pick 1", draftShort: "R1, 1", experience: "6 yrs", shoots: "Left" },
    seasonTotals: { g: 32, a: 45, pts: 77, pim: 18, sog: 210, hits: 45, blk: 32, saves: 0, ga: 0, shutouts: 0, wins: 0, fpts: 248.5, fptsPerGame: 3.8 },
    gameLog: [
      { date: "Sep 28", opp: "vs BOS", result: "W 4-2", g: 1, a: 1, pts: 2, pim: 0, sog: 5, hits: 3, blk: 1, gwg: 1, shg: 0, wins: 0, saves: 0, shotsAgainst: 0, ga: 0, shutout: false, decision: null, toi: "22:14", fpts: 16.3, svPct: ".000", plusMinus: 2 },
      { date: "Sep 26", opp: "@ NYR", result: "L 1-3", g: 0, a: 1, pts: 1, pim: 2, sog: 4, hits: 2, blk: 0, gwg: 0, shg: 0, wins: 0, saves: 0, shotsAgainst: 0, ga: 0, shutout: false, decision: null, toi: "20:45", fpts: 5.5, svPct: ".000", plusMinus: -1 },
      { date: "Sep 24", opp: "vs FLA", result: "W 5-2", g: 2, a: 0, pts: 2, pim: 0, sog: 6, hits: 1, blk: 1, gwg: 0, shg: 0, wins: 0, saves: 0, shotsAgainst: 0, ga: 0, shutout: false, decision: null, toi: "21:14", fpts: 10.5, svPct: ".000", plusMinus: 2 },
      { date: "Sep 22", opp: "@ TOR", result: "W 3-1", g: 0, a: 2, pts: 2, pim: 2, sog: 5, hits: 0, blk: 0, gwg: 0, shg: 0, wins: 0, saves: 0, shotsAgainst: 0, ga: 0, shutout: false, decision: null, toi: "19:45", fpts: 6.5, svPct: ".000", plusMinus: 1 },
    ],
    pastSeasons: [
      { season: "2025-26", team: player.team, gp: 80, g: 42, a: 60, pts: 102, pim: 24, hits: 55, blk: 40, saves: 0, ga: 0, shutouts: 0, wins: 0, fptsPerGame: 4.1, fpts: "328.0", rank: "#4 C" },
      { season: "2024-25", team: player.team, gp: 79, g: 38, a: 54, pts: 92, pim: 18, hits: 48, blk: 35, saves: 0, ga: 0, shutouts: 0, wins: 0, fptsPerGame: 3.9, fpts: "308.1", rank: "#7 C" },
      { season: "2023-24", team: player.team, gp: 82, g: 35, a: 49, pts: 84, pim: 16, hits: 42, blk: 31, saves: 0, ga: 0, shutouts: 0, wins: 0, fptsPerGame: 3.5, fpts: "287.4", rank: "#11 C" },
    ],
    depthChart: [
      { line: "Line 1", slots: [{ label: "LW", name: forwardRole === "LW" ? player.name : "A. Panarin", isTarget: forwardRole === "LW" }, { label: "C", name: forwardRole === "C" ? player.name : "N. MacKinnon", isTarget: forwardRole === "C" }, { label: "RW", name: forwardRole === "RW" ? player.name : "D. Pastrnak", isTarget: forwardRole === "RW" }] },
      { line: "Line 2", slots: [{ label: "LW", name: "K. Kaprizov", isTarget: false }, { label: "C", name: "J. Hughes", isTarget: false }, { label: "RW", name: "M. Rantanen", isTarget: false }] },
      { line: "Line 3", slots: [{ label: "LW", name: "B. Tkachuk", isTarget: false }, { label: "C", name: "E. Pettersson", isTarget: false }, { label: "RW", name: "M. Marner", isTarget: false }] },
      { line: "Line 4", slots: [{ label: "LW", name: "M. Knies", isTarget: false }, { label: "C", name: "T. Stützle", isTarget: false }, { label: "RW", name: "M. Domi", isTarget: false }] },
      { line: "Pair 1", slots: [{ label: "LD", name: defenseRole === "LD" ? player.name : "Q. Hughes", isTarget: defenseRole === "LD" }, { label: "RD", name: "C. Makar", isTarget: false }] },
      { line: "Pair 2", slots: [{ label: "LD", name: "A. Fox", isTarget: false }, { label: "RD", name: "V. Hedman", isTarget: false }] },
      { line: "Pair 3", slots: [{ label: "LD", name: "R. Dahlin", isTarget: false }, { label: "RD", name: "M. Heiskanen", isTarget: false }] },
      { line: "Goalies", slots: [{ label: "STARTER", name: goalieRole ? player.name : "I. Shesterkin", isTarget: goalieRole }, { label: "BACKUP", name: "A. Vasilevskiy", isTarget: false }] },
      { line: "PP1", slots: [{ label: "LW", name: forwardRole === "LW" ? player.name : "A. Panarin", isTarget: forwardRole === "LW" }, { label: "C", name: forwardRole === "C" ? player.name : "N. MacKinnon", isTarget: forwardRole === "C" }, { label: "RW", name: forwardRole === "RW" ? player.name : "D. Pastrnak", isTarget: forwardRole === "RW" }, { label: "F", name: "M. Rantanen", isTarget: false }, { label: defenseRole ? "LD" : "LD", name: defenseRole ? player.name : "C. Makar", isTarget: !!defenseRole }] },
      { line: "PP2", slots: [{ label: "LW", name: "A. Panarin", isTarget: false }, { label: "C", name: "J. Hughes", isTarget: false }, { label: "RW", name: "M. Rantanen", isTarget: false }, { label: "D", name: "A. Fox", isTarget: false }, { label: "D", name: "R. Dahlin", isTarget: false }] },
      { line: "PK1", slots: [{ label: "F", name: "B. Tkachuk", isTarget: false }, { label: "F", name: "T. Stützle", isTarget: false }, { label: "LD", name: "V. Hedman", isTarget: false }, { label: "RD", name: "M. Heiskanen", isTarget: false }] },
      { line: "PK2", slots: [{ label: "F", name: "K. Kaprizov", isTarget: false }, { label: "F", name: "E. Pettersson", isTarget: false }, { label: "LD", name: "C. Makar", isTarget: false }, { label: "RD", name: "Q. Hughes", isTarget: false }] },
    ],
    transactions: [
      { date: "Oct 2025", type: "Draft" as const, description: `Drafted in Round 1 of the Startup Dynasty Draft.` },
    ],
    teamRanks: [
      { label: "OFF", value: "#3" }, { label: "DEF", value: "#8" }, { label: "PP", value: "24.8%" }, { label: "PK", value: "81.2%" },
    ],
    news: { headline: `${player.name} tallies 3 points in win vs BOS`, analysis: "The top-line star continues to drive elite shot volume and power-play production. Keep him locked into every active lineup." },
    projections: [{ week: "Wk 1", fpts: player.projPts.toFixed(1) }, { week: "Wk 2", fpts: (player.projPts + 1.2).toFixed(1) }, { week: "Wk 3", fpts: (player.projPts - 0.4).toFixed(1) }],
  }
}