import axios from 'axios'
import { fetchTeams, fetchTeam } from '../lib/teams'
import { fetchRoster } from '../lib/roster'
import { fetch as fetchScoreboard } from '../lib/scoreboard'
import { fetchStandings } from '../lib/standings'
import {
  getSeasonPhase,
  isPlayoffs,
  getSeriesStatus,
  fetchPlayoffGames,
} from '../lib/playoffs'
import * as Index from '../lib/index'

import { League, SeasonPhase } from '../lib/definitions/enums'
import { TeamDetail, TeamsResponse } from '../lib/definitions/types'

import * as nflTeamsJson from './data/teams/nfl-teams.json'
import * as nflTeam12Json from './data/teams/nfl-team-12.json'
import * as ncaafTeamsJson from './data/teams/ncaaf-teams.json'
import * as nflRoster12Json from './data/roster/nfl-roster-12.json'
import * as nflScoreboardJson from './data/scoreboard/nfl.json'

jest.mock('axios')
const mockedGet = axios.get as jest.MockedFunction<typeof axios.get>

jest.mock('../lib/teams', () => {
  const actual = jest.requireActual('../lib/teams')
  return {
    ...actual,
    fetchTeams: jest.fn(actual.fetchTeams),
    fetchTeam: jest.fn(actual.fetchTeam),
  }
})
const mockedFetchTeams = fetchTeams as jest.MockedFunction<typeof fetchTeams>
const mockedFetchTeam = fetchTeam as jest.MockedFunction<typeof fetchTeam>

const makeTeamDetail = (
  overrides: Partial<TeamDetail> & {
    id: string
    displayName: string
    recordSummary: string
    standingSummary: string
  }
): TeamDetail => ({
  uid: `s:20~l:28~t:${overrides.id}`,
  location: overrides.displayName.split(' ')[0],
  name: overrides.displayName.split(' ').slice(1).join(' '),
  abbreviation: overrides.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3),
  shortDisplayName: overrides.displayName,
  color: '000000',
  alternateColor: 'FFFFFF',
  isActive: true,
  venue: {
    id: '1',
    fullName: 'Test Stadium',
    address: { city: 'Test City', country: 'US' },
    capacity: 50000,
    indoor: false,
  },
  links: [],
  logo: 'https://example.com/logo.png',
  groups: [{ id: '1', name: 'Test Division', abbreviation: 'TD' }],
  franchise: { uid: 'test-franchise', slug: 'test-franchise' },
  logos: [],
  record: {
    name: 'Overall',
    abbreviation: 'Overall',
    type: 'total',
    summary: overrides.recordSummary,
  },
  ...overrides,
  standingSummary: overrides.standingSummary,
})

const makeTeamsResponse = (teamIds: string[]): TeamsResponse => ({
  sports: [
    {
      name: 'football',
      slug: 'football',
      leagues: [
        {
          name: 'National Football League',
          abbreviation: 'NFL',
          slug: 'nfl',
          teams: teamIds.map((id) => ({
            team: {
              id,
              uid: `s:20~l:28~t:${id}`,
              location: 'Test',
              name: 'Team',
              abbreviation: 'TST',
              displayName: `Test Team ${id}`,
              shortDisplayName: `Test ${id}`,
              color: '000000',
              alternateColor: 'FFFFFF',
              isActive: true,
              venue: { id: '1' },
              links: [],
              logo: 'https://example.com/logo.png',
            } as unknown as TeamDetail,
          })),
        },
      ],
    },
  ],
})

beforeEach(() => {
  mockedGet.mockReset()
  const actual = jest.requireActual('../lib/teams')
  mockedFetchTeams.mockReset()
  mockedFetchTeams.mockImplementation(actual.fetchTeams)
  mockedFetchTeam.mockReset()
  mockedFetchTeam.mockImplementation(actual.fetchTeam)
})

describe('Integration Tests', () => {
  describe('Teams → Roster flow', () => {
    test('fetches teams list, extracts team ID, then fetches roster for that team', async () => {
      mockedGet
        .mockResolvedValueOnce({ data: nflTeamsJson })
        .mockResolvedValueOnce({ data: nflRoster12Json })

      const teamsResponse = await fetchTeams(League.NFL)
      const teamEntry = teamsResponse.sports[0].leagues[0].teams[0]
      const teamId = teamEntry.team.id

      expect(teamId).toBe('12')
      expect(teamEntry.team.displayName).toBe('New England Patriots')

      const roster = await fetchRoster(League.NFL, teamId)

      expect(roster.athletes).toHaveLength(3)
      expect(roster.athletes[0].fullName).toBe('Drake Maye')
      expect(roster.athletes[0].position.abbreviation).toBe('QB')
      expect(roster.coach.fullName).toBe('Mike Vrabel')

      expect(mockedGet).toHaveBeenCalledTimes(2)
      expect(mockedGet).toHaveBeenNthCalledWith(
        1,
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams'
      )
      expect(mockedGet).toHaveBeenNthCalledWith(
        2,
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/12/roster'
      )
    })

    test('roster team ID matches the team fetched from teams list', async () => {
      mockedGet
        .mockResolvedValueOnce({ data: nflTeamsJson })
        .mockResolvedValueOnce({ data: nflTeam12Json })
        .mockResolvedValueOnce({ data: nflRoster12Json })

      const teamsResponse = await fetchTeams(League.NFL)
      const teamId = teamsResponse.sports[0].leagues[0].teams[0].team.id

      const team = await fetchTeam(League.NFL, teamId)
      expect(team.id).toBe(teamId)
      expect(team.displayName).toBe('New England Patriots')

      const roster = await fetchRoster(League.NFL, teamId)
      expect(roster.athletes.length).toBeGreaterThan(0)
      expect(roster.athletes[0].jersey).toBe('10')

      expect(mockedGet).toHaveBeenCalledTimes(3)
    })
  })

  describe('Scoreboard → Playoffs flow', () => {
    test('getSeasonPhase identifies regular season from scoreboard data', async () => {
      mockedGet.mockResolvedValue({ data: nflScoreboardJson })

      const scoreboard = await fetchScoreboard(League.NFL)
      const phase = getSeasonPhase(scoreboard.season)

      expect(phase).toBe(SeasonPhase.Regular)
      expect(isPlayoffs(scoreboard.season)).toBe(false)
    })

    test('getSeasonPhase identifies postseason when seasontype=3', async () => {
      const postseasonScoreboard = {
        ...nflScoreboardJson,
        season: { type: 3, year: 2023 },
      }
      mockedGet.mockResolvedValue({ data: postseasonScoreboard })

      const scoreboard = await fetchScoreboard(League.NFL, { seasontype: 3 })
      const phase = getSeasonPhase(scoreboard.season)

      expect(phase).toBe(SeasonPhase.Postseason)
      expect(isPlayoffs(scoreboard.season)).toBe(true)
    })

    test('getSeriesStatus extracts leader/trailer from series data', () => {
      const series = {
        type: 'best-of-7',
        title: 'AFC Championship',
        summary: 'Ravens lead 3-2',
        completed: false,
        totalCompetitions: 7,
        competitors: [
          { id: '33', uid: 's:20~l:28~t:33', wins: 3, ties: 0, href: '' },
          { id: '4', uid: 's:20~l:28~t:4', wins: 2, ties: 0, href: '' },
        ],
      }

      const status = getSeriesStatus(series)

      expect(status.completed).toBe(false)
      expect(status.totalGames).toBe(7)
      expect(status.isBestOf).toBe(7)
      expect(status.leader).toEqual({ id: '33', wins: 3 })
      expect(status.trailer).toEqual({ id: '4', wins: 2 })
    })

    test('fetchPlayoffGames delegates to scoreboard with postseason params', async () => {
      mockedGet.mockResolvedValue({ data: nflScoreboardJson })

      await fetchPlayoffGames(League.NFL, 2023)

      expect(mockedGet).toHaveBeenCalledWith(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?year=2023&seasontype=3'
      )
    })

    test('getSeriesStatus returns null leader/trailer when tied', () => {
      const tiedSeries = {
        type: 'best-of-7',
        title: 'World Series',
        summary: 'Tied 2-2',
        completed: false,
        totalCompetitions: 7,
        competitors: [
          { id: '10', uid: 's:20~l:28~t:10', wins: 2, ties: 0, href: '' },
          { id: '11', uid: 's:20~l:28~t:11', wins: 2, ties: 0, href: '' },
        ],
      }

      const status = getSeriesStatus(tiedSeries)

      expect(status.leader).toBeNull()
      expect(status.trailer).toBeNull()
      expect(status.completed).toBe(false)
    })

    test('getSeasonPhase covers all season phases', () => {
      expect(getSeasonPhase({ type: 1 })).toBe(SeasonPhase.Preseason)
      expect(getSeasonPhase({ type: 2 })).toBe(SeasonPhase.Regular)
      expect(getSeasonPhase({ type: 3 })).toBe(SeasonPhase.Postseason)
      expect(getSeasonPhase({ type: 4 })).toBe(SeasonPhase.Offseason)
    })

    test('getSeasonPhase throws for unknown type', () => {
      expect(() => getSeasonPhase({ type: 99 })).toThrow(
        'Unknown season type: 99'
      )
    })
  })

  describe('Teams → Standings flow', () => {
    test('standings aggregates team details and sorts by wins descending', async () => {
      const teamsResponse = makeTeamsResponse(['12', '9'])

      const team12 = makeTeamDetail({
        id: '12',
        displayName: 'New England Patriots',
        recordSummary: '4-13',
        standingSummary: '4th in AFC East',
      })

      const team9 = makeTeamDetail({
        id: '9',
        displayName: 'Dallas Cowboys',
        recordSummary: '12-5',
        standingSummary: '1st in NFC East',
      })

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockImplementation((_league, teamId) => {
        if (teamId === '12') return Promise.resolve(team12)
        if (teamId === '9') return Promise.resolve(team9)
        return Promise.reject(new Error('Unknown team'))
      })

      const result = await fetchStandings(League.NFL)

      expect(result).toHaveLength(2)
      expect(result[0].team.displayName).toBe('Dallas Cowboys')
      expect(result[0].wins).toBe(12)
      expect(result[0].losses).toBe(5)
      expect(result[0].percentage).toBe('.706')
      expect(result[1].team.displayName).toBe('New England Patriots')
      expect(result[1].wins).toBe(4)
      expect(result[1].losses).toBe(13)
      expect(result[1].percentage).toBe('.235')
    })

    test('each standings entry has valid team, record, and percentage data', async () => {
      const teamsResponse = makeTeamsResponse(['12', '9'])

      const team12 = makeTeamDetail({
        id: '12',
        displayName: 'New England Patriots',
        recordSummary: '4-13',
        standingSummary: '4th in AFC East',
      })

      const team9 = makeTeamDetail({
        id: '9',
        displayName: 'Dallas Cowboys',
        recordSummary: '12-5',
        standingSummary: '1st in NFC East',
      })

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockImplementation((_league, teamId) => {
        if (teamId === '12') return Promise.resolve(team12)
        if (teamId === '9') return Promise.resolve(team9)
        return Promise.reject(new Error('Unknown team'))
      })

      const result = await fetchStandings(League.NFL)

      for (const entry of result) {
        expect(entry.team).toBeDefined()
        expect(entry.team.id).toBeTruthy()
        expect(entry.team.displayName).toBeTruthy()
        expect(entry.record).toBeDefined()
        expect(entry.record.summary).toMatch(/^\d+-\d+/)
        expect(entry.standingSummary).toBeTruthy()
        expect(entry.wins).toBeGreaterThanOrEqual(0)
        expect(entry.losses).toBeGreaterThanOrEqual(0)
        expect(entry.percentage).toMatch(/^\.\d{3}$/)
      }
    })
  })

  describe('Multi-league URL verification', () => {
    test('NFL teams endpoint uses football/nfl path', async () => {
      mockedGet.mockResolvedValue({ data: nflTeamsJson })

      await fetchTeams(League.NFL)

      expect(mockedGet).toHaveBeenCalledWith(
        expect.stringContaining('football/nfl/teams')
      )
    })

    test('NCAAF teams endpoint uses football/college-football path', async () => {
      mockedGet.mockResolvedValue({ data: ncaafTeamsJson })

      await fetchTeams(League.NCAAF)

      expect(mockedGet).toHaveBeenCalledWith(
        expect.stringContaining('football/college-football/teams')
      )
    })

    test('MLS teams endpoint uses soccer/usa.1 path', async () => {
      const mlsTeamsResponse = {
        sports: [
          {
            name: 'soccer',
            slug: 'soccer',
            leagues: [
              {
                name: 'Major League Soccer',
                abbreviation: 'MLS',
                slug: 'usa.1',
                teams: [],
              },
            ],
          },
        ],
      }
      mockedGet.mockResolvedValue({ data: mlsTeamsResponse })

      await fetchTeams(League.MLS)

      expect(mockedGet).toHaveBeenCalledWith(
        expect.stringContaining('soccer/usa.1/teams')
      )
    })

    test('NHL scoreboard endpoint uses hockey/nhl path', async () => {
      const nhlScoreboard = {
        leagues: [],
        season: { type: 2, year: 2024 },
        day: { date: '2024-01-01' },
        events: [],
      }
      mockedGet.mockResolvedValue({ data: nhlScoreboard })

      await fetchScoreboard(League.NHL)

      expect(mockedGet).toHaveBeenCalledWith(
        expect.stringContaining('hockey/nhl/scoreboard')
      )
    })

    test('MLB scoreboard endpoint uses baseball/mlb path', async () => {
      const mlbScoreboard = {
        leagues: [],
        season: { type: 2, year: 2024 },
        day: { date: '2024-01-01' },
        events: [],
      }
      mockedGet.mockResolvedValue({ data: mlbScoreboard })

      await fetchScoreboard(League.MLB)

      expect(mockedGet).toHaveBeenCalledWith(
        expect.stringContaining('baseball/mlb/scoreboard')
      )
    })
  })

  describe('Barrel export smoke test', () => {
    const expectedNamespaces = [
      'Summary',
      'Scoreboard',
      'Teams',
      'Roster',
      'Draft',
      'Injuries',
      'News',
      'Standings',
      'Playoffs',
    ] as const

    test('all 9 namespace exports exist', () => {
      for (const name of expectedNamespaces) {
        expect(Index[name]).toBeDefined()
        expect(typeof Index[name]).toBe('object')
      }
    })

    test('each namespace has a fetch or equivalent function', () => {
      expect(typeof Index.Summary.fetch).toBe('function')
      expect(typeof Index.Scoreboard.fetch).toBe('function')
      expect(typeof Index.Teams.fetchTeams).toBe('function')
      expect(typeof Index.Teams.fetchTeam).toBe('function')
      expect(typeof Index.Roster.fetchRoster).toBe('function')
      expect(typeof Index.Draft.fetchDraft).toBe('function')
      expect(typeof Index.Injuries.fetchInjuries).toBe('function')
      expect(typeof Index.News.fetchNews).toBe('function')
      expect(typeof Index.Standings.fetchStandings).toBe('function')
      expect(typeof Index.Playoffs.fetchPlayoffGames).toBe('function')
    })

    test('enums and types are re-exported', () => {
      expect(Index.League).toBeDefined()
      expect(Index.League.NFL).toBe(2)
      expect(Index.SeasonPhase).toBeDefined()
      expect(Index.SeasonPhase.Postseason).toBe(3)
    })
  })
})
