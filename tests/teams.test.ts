import axios from 'axios'
import { fetchTeams, fetchTeam } from '../lib/teams'

import * as nflTeamsJson from './data/teams/nfl-teams.json'
import * as nflTeam12Json from './data/teams/nfl-team-12.json'
import * as ncaafTeamsJson from './data/teams/ncaaf-teams.json'
import expectedTeam12 from './data/teams/expected-team-12.json'

import { League } from '../lib/definitions/enums'

jest.mock('axios')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('teams module', () => {
  describe('fetchTeams', () => {
    test('returns NFL team list', async () => {
      axios.get = jest.fn().mockResolvedValue({ data: nflTeamsJson })

      const result = await fetchTeams(League.NFL)

      expect(result.sports).toHaveLength(1)
      expect(result.sports[0].leagues).toHaveLength(1)
      expect(result.sports[0].leagues[0].abbreviation).toBe('NFL')
      expect(result.sports[0].leagues[0].teams).toHaveLength(2)
      expect(result.sports[0].leagues[0].teams[0].team.displayName).toBe(
        'New England Patriots'
      )
      expect(result.sports[0].leagues[0].teams[1].team.displayName).toBe(
        'Dallas Cowboys'
      )
    })

    test('calls correct URL for NFL', async () => {
      axios.get = jest.fn().mockResolvedValue({ data: nflTeamsJson })

      await fetchTeams(League.NFL)

      expect(axios.get).toHaveBeenCalledWith(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams'
      )
    })

    test('returns NCAAF team list with pagination options', async () => {
      axios.get = jest.fn().mockResolvedValue({ data: ncaafTeamsJson })

      const result = await fetchTeams(League.NCAAF, { limit: 50, page: 1 })

      expect(result.sports[0].leagues[0].abbreviation).toBe('NCAAF')
      expect(result.sports[0].leagues[0].teams).toHaveLength(2)
      expect(
        result.sports[0].leagues[0].teams[0].team.displayName
      ).toBe('Alabama Crimson Tide')
    })

    test('calls correct URL with pagination query params', async () => {
      axios.get = jest.fn().mockResolvedValue({ data: ncaafTeamsJson })

      await fetchTeams(League.NCAAF, { limit: 50, page: 1 })

      expect(axios.get).toHaveBeenCalledWith(
        'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=50&page=1'
      )
    })

    test('calls correct URL with only limit', async () => {
      axios.get = jest.fn().mockResolvedValue({ data: nflTeamsJson })

      await fetchTeams(League.NFL, { limit: 25 })

      expect(axios.get).toHaveBeenCalledWith(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=25'
      )
    })

    test('calls correct URL with only page', async () => {
      axios.get = jest.fn().mockResolvedValue({ data: nflTeamsJson })

      await fetchTeams(League.NFL, { page: 2 })

      expect(axios.get).toHaveBeenCalledWith(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?page=2'
      )
    })
  })

  describe('fetchTeam', () => {
    test('returns Patriots team detail', async () => {
      axios.get = jest.fn().mockResolvedValue({ data: nflTeam12Json })

      const result = await fetchTeam(League.NFL, '12')

      expect(result).toStrictEqual(expectedTeam12)
      expect(result.id).toBe('12')
      expect(result.displayName).toBe('New England Patriots')
      expect(result.abbreviation).toBe('NE')
      expect(result.record.summary).toBe('4-13')
      expect(result.standingSummary).toBe('4th in AFC East')
      expect(result.groups).toHaveLength(2)
      expect(result.venue.fullName).toBe('Gillette Stadium')
    })

    test('calls correct URL for team detail', async () => {
      axios.get = jest.fn().mockResolvedValue({ data: nflTeam12Json })

      await fetchTeam(League.NFL, '12')

      expect(axios.get).toHaveBeenCalledWith(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/12'
      )
    })
  })

  describe('error handling', () => {
    test('fetchTeams throws meaningful error on failure', async () => {
      axios.get = jest.fn().mockRejectedValue(new Error('Network timeout'))

      await expect(fetchTeams(League.NFL)).rejects.toThrow('Network timeout')
    })

    test('fetchTeam throws meaningful error on failure', async () => {
      axios.get = jest.fn().mockRejectedValue(new Error('Not Found'))

      await expect(fetchTeam(League.NFL, '999')).rejects.toThrow('Not Found')
    })

    test('fetchTeams handles string rejection', async () => {
      axios.get = jest.fn().mockRejectedValue('unknown failure')

      await expect(fetchTeams(League.NFL)).rejects.toThrow('unknown failure')
    })

    test('fetchTeam handles object rejection', async () => {
      axios.get = jest.fn().mockRejectedValue({ status: 500 })

      await expect(fetchTeam(League.NFL, '1')).rejects.toThrow(
        'An unknown error occurred while fetching team detail'
      )
    })
  })
})
