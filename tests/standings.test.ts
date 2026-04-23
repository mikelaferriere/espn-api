import { fetchStandings } from '../lib/standings'
import { fetchTeams, fetchTeam } from '../lib/teams'
import { League } from '../lib/definitions/enums'
import { TeamDetail, TeamsResponse } from '../lib/definitions/types'

jest.mock('../lib/teams')

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
  groups: [
    { id: '1', name: 'Test Division', abbreviation: 'TD' },
  ],
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

const makeTeamsResponse = (
  teamIds: string[]
): TeamsResponse => ({
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
  jest.resetAllMocks()
})

describe('standings module', () => {
  describe('fetchStandings', () => {
    test('returns sorted standings with correct wins/losses for NFL', async () => {
      const teamsResponse = makeTeamsResponse(['12', '34'])

      const team12 = makeTeamDetail({
        id: '12',
        displayName: 'New England Patriots',
        recordSummary: '10-7-0',
        standingSummary: '1st in AFC East',
      })

      const team34 = makeTeamDetail({
        id: '34',
        displayName: 'Dallas Cowboys',
        recordSummary: '12-5-0',
        standingSummary: '1st in NFC East',
      })

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockImplementation((_league, teamId) => {
        if (teamId === '12') return Promise.resolve(team12)
        if (teamId === '34') return Promise.resolve(team34)
        return Promise.reject(new Error('Unknown team'))
      })

      const result = await fetchStandings(League.NFL)

      expect(result).toHaveLength(2)
      expect(result[0].team.displayName).toBe('Dallas Cowboys')
      expect(result[0].wins).toBe(12)
      expect(result[0].losses).toBe(5)
      expect(result[0].ties).toBe(0)
      expect(result[1].team.displayName).toBe('New England Patriots')
      expect(result[1].wins).toBe(10)
      expect(result[1].losses).toBe(7)
      expect(result[1].ties).toBe(0)
    })

    test('parses "10-7-0" record to wins=10, losses=7, ties=0', async () => {
      const teamsResponse = makeTeamsResponse(['12'])
      const team12 = makeTeamDetail({
        id: '12',
        displayName: 'New England Patriots',
        recordSummary: '10-7-0',
        standingSummary: '1st in AFC East',
      })

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockResolvedValue(team12)

      const result = await fetchStandings(League.NFL)

      expect(result[0].wins).toBe(10)
      expect(result[0].losses).toBe(7)
      expect(result[0].ties).toBe(0)
    })

    test('parses "55-27" record to wins=55, losses=27, ties=undefined', async () => {
      const teamsResponse = makeTeamsResponse(['1'])
      const team1 = makeTeamDetail({
        id: '1',
        displayName: 'Boston Celtics',
        recordSummary: '55-27',
        standingSummary: '1st in Atlantic',
      })

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockResolvedValue(team1)

      const result = await fetchStandings(League.NBA)

      expect(result[0].wins).toBe(55)
      expect(result[0].losses).toBe(27)
      expect(result[0].ties).toBeUndefined()
    })

    test('sorts standings by wins descending', async () => {
      const teamsResponse = makeTeamsResponse(['1', '2', '3'])

      const team1 = makeTeamDetail({
        id: '1',
        displayName: 'Low Team',
        recordSummary: '3-14-0',
        standingSummary: 'Last',
      })
      const team2 = makeTeamDetail({
        id: '2',
        displayName: 'High Team',
        recordSummary: '14-3-0',
        standingSummary: 'First',
      })
      const team3 = makeTeamDetail({
        id: '3',
        displayName: 'Mid Team',
        recordSummary: '8-9-0',
        standingSummary: 'Middle',
      })

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockImplementation((_league, teamId) => {
        if (teamId === '1') return Promise.resolve(team1)
        if (teamId === '2') return Promise.resolve(team2)
        if (teamId === '3') return Promise.resolve(team3)
        return Promise.reject(new Error('Unknown team'))
      })

      const result = await fetchStandings(League.NFL)

      expect(result[0].wins).toBe(14)
      expect(result[1].wins).toBe(8)
      expect(result[2].wins).toBe(3)
    })

    test('uses percentage as tiebreaker when wins are equal', async () => {
      const teamsResponse = makeTeamsResponse(['1', '2'])

      const team1 = makeTeamDetail({
        id: '1',
        displayName: 'Team A',
        recordSummary: '10-7-0',
        standingSummary: '2nd',
      })
      const team2 = makeTeamDetail({
        id: '2',
        displayName: 'Team B',
        recordSummary: '10-6-0',
        standingSummary: '1st',
      })

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockImplementation((_league, teamId) => {
        if (teamId === '1') return Promise.resolve(team1)
        if (teamId === '2') return Promise.resolve(team2)
        return Promise.reject(new Error('Unknown team'))
      })

      const result = await fetchStandings(League.NFL)

      expect(result).toHaveLength(2)
      expect(result[0].team.displayName).toBe('Team B')
      expect(result[0].percentage).toBe('.625')
      expect(result[1].team.displayName).toBe('Team A')
      expect(result[1].percentage).toBe('.588')
    })

    test('calculates percentage correctly', async () => {
      const teamsResponse = makeTeamsResponse(['1'])
      const team1 = makeTeamDetail({
        id: '1',
        displayName: 'Test Team',
        recordSummary: '10-7-0',
        standingSummary: '1st',
      })

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockResolvedValue(team1)

      const result = await fetchStandings(League.NFL)

      expect(result[0].percentage).toBe('.588')
    })

    test('handles zero games played', async () => {
      const teamsResponse = makeTeamsResponse(['1'])
      const team1 = makeTeamDetail({
        id: '1',
        displayName: 'Test Team',
        recordSummary: '0-0',
        standingSummary: 'TBD',
      })

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockResolvedValue(team1)

      const result = await fetchStandings(League.NFL)

      expect(result[0].percentage).toBe('.000')
      expect(result[0].wins).toBe(0)
      expect(result[0].losses).toBe(0)
      expect(result[0].ties).toBeUndefined()
    })

    test('throws error when fetchTeams fails', async () => {
      mockedFetchTeams.mockRejectedValue(new Error('API unavailable'))

      await expect(fetchStandings(League.NFL)).rejects.toThrow(
        'API unavailable'
      )
    })

    test('throws error when fetchTeam fails', async () => {
      const teamsResponse = makeTeamsResponse(['1'])

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockRejectedValue(new Error('Team not found'))

      await expect(fetchStandings(League.NFL)).rejects.toThrow(
        'Team not found'
      )
    })

    test('calls fetchTeams and fetchTeam with correct arguments', async () => {
      const teamsResponse = makeTeamsResponse(['12', '34'])
      const team12 = makeTeamDetail({
        id: '12',
        displayName: 'Team A',
        recordSummary: '5-5-0',
        standingSummary: 'Tied',
      })
      const team34 = makeTeamDetail({
        id: '34',
        displayName: 'Team B',
        recordSummary: '5-5-0',
        standingSummary: 'Tied',
      })

      mockedFetchTeams.mockResolvedValue(teamsResponse)
      mockedFetchTeam.mockImplementation((_league, teamId) => {
        if (teamId === '12') return Promise.resolve(team12)
        if (teamId === '34') return Promise.resolve(team34)
        return Promise.reject(new Error('Unknown team'))
      })

      await fetchStandings(League.NFL)

      expect(mockedFetchTeams).toHaveBeenCalledWith(League.NFL)
      expect(mockedFetchTeam).toHaveBeenCalledWith(League.NFL, '12')
      expect(mockedFetchTeam).toHaveBeenCalledWith(League.NFL, '34')
    })
  })
})
