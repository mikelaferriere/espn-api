export interface BaseScoreboard {
  leagues: LeagueDetails[]
  season: {
    year: number
    type: number
  }
  day: {
    date: string
  }
  events: Event[]
  default?: {
    leagues: LeagueDetails[]
    season: {
      year: number
      type: number
    }
    day: {
      date: string
    }
    events: Event[]
  }
}

export interface LeagueDetails {
  id: string
  uid: string
  name: string
  abbreviation: string
  slug: string
  season: SeasonDetailed
  logos: Logo[]
  calendarType: string
  calendarIsWhitelist: boolean
  calendarStartDate: string
  calendarEndDate: string
  calendar: string[]
}

export interface SeasonDetailed {
  year: number
  startDate: string
  endDate: string
  displayName: string
  type: {
    id: string
    type: number
    name: string
    abbreviation: string
  }
}

export interface Logo {
  href: string
  width: number
  height: number
  alt: string
  rel: string[]
  lastUpdated: string
}

export interface Event {
  id: string
  uid: string
  date: string
  name: string
  shortName: string
  season: {
    year: number
    type: number
    slug: string
  }
  competitions: Competition[]
  links: Link[]
  status: Status
}

export interface Competition {
  id: string
  uid: string
  date: string
  attendance: number
  type: {
    id: string
    abbreviation: string
  }
  timeValid: boolean
  neutralSite: boolean
  conferenceCompetition?: boolean
  playByPlayAvailable: boolean
  recent: boolean
  wasSuspended?: boolean
  venue: Venue
  competitors: Competitor[]
  notes: {
    type: string
    headline: string
  }[]
  status: Status
  broadcasts: {
    market: string
    names: string[]
  }[]
  format: {
    regulation: {
      periods: number
    }
  }
  startDate: string
  series: Series
  geoBroadcasts: {
    type: {
      id: string
      shortName: string
    }
    market: {
      id: string
      type: string
    }
    media: {
      shortName: string
    }
    lang: string
    region: string
  }[]
  headlines: {
    description: string
    type: string
    shortLinkText: string
  }[]
}

export interface Series {
  type: string
  title: string
  summary: string
  completed: boolean
  totalCompetitions: number
  competitors: {
    id: string
    uid: string
    wins: number
    ties: number
    href: string
  }[]
}

export interface Record {
  name: string
  abbreviation: string
  type: string
  summary: string
}

export interface Competitor {
  id: string
  uid: string
  type: string
  order: number
  homeAway: string
  winner: boolean
  team: Team
  score: string
  linescores: {
    value: number
  }[]
  statistics: Statistic[]
  leaders: Leader[]
  probables: FeaturedAthlete[]
  records: Record[]
}

export interface Leader {
  name: string
  displayName: string
  shortDisplayName: string
  abbreviation: string
  leaders: {
    displayName: string
    value: number
    athlete: Athlete
    team: {
      id: string
    }
  }[]
}

export interface Statistic {
  name: string
  abbreviation: string
  displayValue: string
}

export interface Venue {
  id: string
  fullName: string
  address: {
    city: string
    country: string
  }
  capacity: number
  indoor: boolean
}

export interface Link {
  language?: string
  rel: string[]
  href: string
  text?: string
  shortText?: string
  isExternal?: boolean
  isPremium?: boolean
}

export interface Status {
  clock: number
  displayClock: string
  period: number
  type: {
    id: string
    name: string
    state: string
    completed: boolean
    description: string
    detail: string
    shortDetail: string
  }
  featuredAthletes: FeaturedAthlete[]
}

export interface Athlete {
  id: number
  fullName: string
  displayName: string
  shortName: string
  links: Link[]
  headshot: string
  jersey: string
  position: string | { abbreviation: string }
  team: {
    id: string
  }
  active?: boolean
}

export interface FeaturedAthlete {
  name: string
  displayName: string
  shortDisplayName: string
  abbreviation: string
  playerId: number
  athlete: Athlete
  team: {
    id: string
  }
  statistics: Statistic[]
  status?: {
    id: string
    name: string
    type: string
    abbreviation: string
  }
}

export interface Team {
  id: string
  uid: string
  location: string
  name: string
  abbreviation: string
  displayName: string
  shortDisplayName: string
  color: string
  alternateColor: string
  isActive: boolean
  venue: {
    id: string
  }
  links: Link[]
  logo: string
}

export interface Drive {
  id: string
  description: string
  team: {
    name: string
    abbreviation: string
    displayName: string
    shortDisplayName: string
    logos: Logo[]
  }
  start: {
    period: {
      type: string
      number: number
    }
    clock: {
      displayValue: string
    }
    yardLine: number
    text: string
  }
  end?: {
    period: {
      type: string
      number: number
    }
    clock: {
      displayValue: string
    }
    yardLine: number
    text: string
  }
  timeElapsed: {
    displayValue: string
  }
  yards: number
  isScore: boolean
  offensivePlays: number
  result: string
  shortDisplayResult: string
  displayResult: string
  plays: Play[]
}

/**
 * Base detail type for the /summary endpoint
 */
export interface BaseGameDetails {
  /**
   * The game's boxscore
   */
  boxscore: BoxScore
  /**
   * The game's format
   */
  format: {
    regulation: {
      periods: number
      displayName: string
      slug: string
      clock: number
    }
  }
  gameInfo: {
    venue: Venue
    attendance: number
    officials: {
      id: string
      fullName: string
      position: string
      links: Link[]
    }[]
  }
  drives?: {
    previous: Drive[]
    current?: Drive
  }
  leaders: Leader[]
  plays: Play[]
  standings: {
    team: Team
    record: Record
  }[]
}

export interface BoxScore {
  teams: {
    team: Team
    statistics: Statistic[]
  }[]
  players: {
    team: Team
    statistics: {
      name: string
      keys: string[]
      labels: string[]
      descriptions: string[]
      athletes: {
        athlete: Athlete
      }
    }
  }[]
}

export interface Play {
  id: string
  sequenceNumber: string
  type: {
    id: string
    text: string
    abbreviation: string
  }
  text: string
  awayScore: number
  homeScore: number
  period: {
    type?: string
    number: number
    displayValue: string
  }
  clock?: {
    displayValue: string
  }
  participants?: {
    athlete: Athlete
    type: string
  }[]
  scoringPlay: boolean
  priority?: boolean
  scoreValue?: number
  modified: string
  wallclock: string
  team?: {
    id?: string
    name?: string
    abbreviation?: string
    displayName?: string
    shortDisplayName?: string
    logos?: Logo[]
  }

  // Start Hockey Related
  shootingPlay?: boolean
  coordinate?: {
    x: number
    y: number
  }
  strength?: {
    id: string
    text: string
    abbreviation: string
  }
  shotInfo?: {
    id: string
    text: string
    abbreviation: string
  }
  // End Hockey Related

  // Start Football related
  start?: {
    down?: number
    distance?: number
    yardLine?: number
    yardsToEndzone?: number
    downDistanceText?: string
    shortDownDistanceText?: string
    possessionText?: string
    team: {
      id: string
    }
  }
  end?: {
    down?: number
    distance?: number
    yardLine?: number
    yardsToEndzone?: number
    downDistanceText?: string
    shortDownDistanceText?: string
    possessionText?: string
    team: {
      id: string
    }
  }
  // End Football Related

  // Start Baseball Related
  atBatId?: string
  batOrder?: number
  bats?: {
    type: string
    abbreviation: string
    displayValue: string
  }
  atBatPitchNumber?: number
  hitCoordinate?: {
    x: number
    y: number
  }
  pitchCoordinate?: {
    x: number
    y: number
  }
  pitchType?: {
    id: string
    text: string
    abbreviation: string
  }
  pitchVelocity?: number
  summaryType?: string
  pitchCount?: {
    balls: number
    strikes: number
  }
  resultCount?: {
    balls: number
    strikes: number
  }
  trajectory?: string
  outs?: number
  onFirst?: {
    athlete: {
      id: string
    }
  }
  onSecond?: {
    athlete: {
      id: string
    }
  }
  onThird?: {
    athlete: {
      id: string
    }
  }
  // End Baseball Related
}

export interface ScoreboardOptions {
  dates?: string // YYYYMMDD or YYYYMMDD-YYYYMMDD for range
  week?: number // Week number (for football)
  year?: number // Season year
  seasontype?: number // 1=preseason, 2=regular, 3=postseason
  limit?: number // Max results
}

// Teams endpoint types
export interface TeamsResponse {
  sports: {
    name: string
    slug: string
    leagues: {
      name: string
      abbreviation: string
      slug: string
      teams: {
        team: TeamDetail
      }[]
    }[]
  }[]
}

export interface TeamDetail extends Team {
  record: Record
  standingSummary: string
  groups: {
    id: string
    name: string
    abbreviation: string
  }[]
  franchise: {
    uid: string
    slug: string
  }
  venue: Venue
  logos: Logo[]
  color: string
  alternateColor: string
}

// Roster endpoint types
export interface RosterResponse {
  athletes: AthleteDetail[]
  coach: Coach
}

export interface AthleteDetail {
  id: string
  uid: string
  fullName: string
  displayName: string
  shortName: string
  headshot: {
    href: string
  }
  jersey: string
  position: {
    id: string
    name: string
    displayName: string
    abbreviation: string
  }
  age: number
  dateOfBirth: string
  weight: number
  height: number
  experience: {
    years: number
    displayValue: string
  }
  active: boolean
  injuries: {
    id: string
    type: string
    status: {
      id: string
      name: string
      type: string
      abbreviation: string
    }
    date: string
    returnDate: string
  }[]
  contracts?: {
    details: {
      year: number
      type: string
      value: number
    }[]
  }
  stats: Statistic[]
}

export interface Coach {
  id: string
  uid: string
  fullName: string
  displayName: string
  firstName: string
  lastName: string
  experience: number
}

// Draft endpoint types
export interface DraftResponse {
  sports: {
    name: string
    slug: string
    leagues: {
      name: string
      abbreviation: string
      draft: {
        rounds: DraftRound[]
      }
    }[]
  }[]
}

export interface DraftRound {
  number: number
  picks: DraftPick[]
}

export interface DraftPick {
  round: number
  pick: number
  overall: number
  team: Team
  athlete?: Athlete
  trade: {
    note: string
    teams: {
      team: Team
      gave: string[]
      received: string[]
    }[]
  }
}

// Injuries endpoint types
export interface InjuriesResponse {
  sports: {
    name: string
    leagues: {
      name: string
      abbreviation: string
      teams: {
        team: Team
        injuries: Injury[]
      }[]
    }[]
  }[]
}

export interface Injury {
  id: string
  type: string
  status: {
    id: string
    name: string
    type: string
    abbreviation: string
  }
  date: string
  returnDate: string
  athlete: Athlete
  details: {
    position: string
    type: string
    side: string
  }
}

// News endpoint types
export interface NewsResponse {
  articles: {
    id: string
    description: string
    type: string
    story: string
    headline: string
    shortHeadline: string
    byline: string
    published: string
    lastModified: string
    links: Link[]
    images: {
      name: string
      type: string
      url: string
      width: number
      height: number
    }[]
    categories: {
      id: string
      type: string
      team: {
        id: string
      }
    }[]
  }[]
}
