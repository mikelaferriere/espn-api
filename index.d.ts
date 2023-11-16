interface BaseScoreboard {
  id: string
  name: string
  abbreviation: string
  slug: string
  events: Event[]
}

interface SportingEvent {
  id: string
  name: string
  shortName: string
  homeTeam: Team
  awayTeam: Team
}

interface Team {
  id: string
  name: string
  abbreviation: string
  displayName: string
  shortDisplayName: string
  location: string
  logo: string
}

interface GameDetails {
  homeTeam: Team
  awayTeam: Team
  plays: Play[]
}

interface PlayType {
  id: string
  text: string
  abbreviation: string
}

interface Play {
  id: string
  type: PlayType
  text: string
  scoringPlay: boolean
  homeScore: number
  awayScore: number
  team?: string
}