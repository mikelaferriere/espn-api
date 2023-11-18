

export interface BaseScoreboard {
  leagues: League[]
  season: {
    year: number
    type: number
  }
  day: {
    date: string
  }
  events: Event[]
  default?: {
    leagues: League[]
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

export interface League {
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
  format: any
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
  probables: FeaturedAthelete[]
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
  featuredAthletes: FeaturedAthelete[]
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

export interface FeaturedAthelete {
  name: string
  displayName: string
  shortDisplayName: string
  abbreviation: string
  playerId: number
  athelete: Athlete
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

export interface BaseGameDetails {
  boxscore: BoxScore
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
    officials: any[]
  }
  leaders: Leader[]
  plays: Play[]
  standings: any[]
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
    number: number
    displayName: string
  }
  clock: {
    displayValue: string
  }
  scoringPlay: boolean
  scoreValue: number
  modified: string
  wallclock: string
  shootingPlay?: boolean
  team: {
    id: string
  }
}