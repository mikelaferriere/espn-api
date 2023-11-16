export interface BaseScoreboard {
  id: string
  name: string
  abbreviation: string
  slug: string
  events: Event[]
}

export interface SportingEvent {
  id: string
  name: string
  shortName: string
  homeTeam: Team
  awayTeam: Team
}

export interface Team {
  id: string
  name: string
  abbreviation: string
  displayName: string
  shortDisplayName: string
  location: string
  logo: string
}

export interface GameDetails {
  homeTeam: Team
  awayTeam: Team
  plays: Play[]
}

export interface PlayType {
  id: string
  text: string
  abbreviation: string
}

export interface Play {
  id: string
  type: PlayType
  text: string
  scoringPlay: boolean
  homeScore: number
  awayScore: number
  team?: string
}