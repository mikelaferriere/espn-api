import axios from 'axios'
import { fetchInjuries } from '../lib/injuries'
import * as nflInjuries from './data/injuries/nfl-injuries.json'
import { League } from '../lib/definitions/enums'

jest.mock('axios')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('injuries module', () => {
  test('returns all injuries for a league', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflInjuries })

    const result = await fetchInjuries(League.NFL)

    expect(result.sports).toHaveLength(1)
    expect(result.sports[0].name).toBe('football')
    expect(result.sports[0].leagues[0].abbreviation).toBe('NFL')
    expect(result.sports[0].leagues[0].teams).toHaveLength(3)
  })

  test('filters injuries by teamId', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflInjuries })

    const result = await fetchInjuries(League.NFL, { teamId: '12' })

    const teams = result.sports[0].leagues[0].teams
    expect(teams).toHaveLength(1)
    expect(teams[0].team.id).toBe('12')
    expect(teams[0].team.displayName).toBe('New England Patriots')
    expect(teams[0].injuries).toHaveLength(3)
  })

  test('filters by teamId and limits injuries per team', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflInjuries })

    const result = await fetchInjuries(League.NFL, {
      teamId: '12',
      limit: 2,
    })

    const teams = result.sports[0].leagues[0].teams
    expect(teams).toHaveLength(1)
    expect(teams[0].team.id).toBe('12')
    expect(teams[0].injuries).toHaveLength(2)
    expect(teams[0].injuries[0].id).toBe('12345')
    expect(teams[0].injuries[1].id).toBe('12346')
  })

  test('limits injuries without team filtering', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflInjuries })

    const result = await fetchInjuries(League.NFL, { limit: 1 })

    const teams = result.sports[0].leagues[0].teams
    expect(teams).toHaveLength(3)
    teams.forEach((teamEntry) => {
      expect(teamEntry.injuries).toHaveLength(1)
    })
  })

  test('returns empty teams when teamId has no match', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflInjuries })

    const result = await fetchInjuries(League.NFL, { teamId: '9999' })

    expect(result.sports[0].leagues[0].teams).toHaveLength(0)
  })

  test('throws meaningful error on network failure', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network Error'))

    await expect(fetchInjuries(League.NFL)).rejects.toThrow('Network Error')
  })

  test('throws meaningful error when error is a string', async () => {
    axios.get = jest.fn().mockRejectedValue('timeout')

    await expect(fetchInjuries(League.NFL)).rejects.toThrow('timeout')
  })

  test('throws generic error for unknown error types', async () => {
    axios.get = jest.fn().mockRejectedValue(42)

    await expect(fetchInjuries(League.NFL)).rejects.toThrow(
      'An unknown error occurred while fetching injuries data'
    )
  })

  test('calls axios.get with correct URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflInjuries })

    await fetchInjuries(League.NFL)

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/injuries'
    )
  })

  test('calls axios.get with correct URL for different leagues', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflInjuries })

    await fetchInjuries(League.NHL)

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/injuries'
    )
  })
})
