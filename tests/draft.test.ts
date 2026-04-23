import axios from 'axios'
import { fetchDraft } from '../lib/draft'

import * as nflDraftJson from './data/draft/nfl-draft.json'

import { League } from '../lib/definitions/enums'

jest.mock('axios')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('draft module', () => {
  test('fetchDraft returns rounds with picks', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflDraftJson })

    const result = await fetchDraft(League.NFL)

    expect(result.sports).toHaveLength(1)
    expect(result.sports[0].leagues).toHaveLength(1)
    const draft = result.sports[0].leagues[0].draft
    expect(draft.rounds).toHaveLength(1)
    expect(draft.rounds[0].number).toBe(1)
    expect(draft.rounds[0].picks).toHaveLength(2)
    expect(draft.rounds[0].picks[0].overall).toBe(1)
    expect(draft.rounds[0].picks[0].athlete?.fullName).toBe('Caleb Williams')
  })

  test('fetchDraft passes year option in URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflDraftJson })

    await fetchDraft(League.NFL, { year: 2023 })

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/draft?year=2023'
    )
  })

  test('fetchDraft passes both year and limit options in URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflDraftJson })

    await fetchDraft(League.NFL, { year: 2023, limit: 10 })

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/draft?year=2023&limit=10'
    )
  })

  test('fetchDraft passes limit-only option in URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflDraftJson })

    await fetchDraft(League.NFL, { limit: 5 })

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/draft?limit=5'
    )
  })

  test('fetchDraft constructs correct URL without options', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflDraftJson })

    await fetchDraft(League.NFL)

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/draft'
    )
  })

  test('fetchDraft throws meaningful error on failure', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network timeout'))

    await expect(fetchDraft(League.NFL)).rejects.toThrow('Network timeout')
  })

  test('fetchDraft handles non-Error rejection', async () => {
    axios.get = jest.fn().mockRejectedValue('unknown failure')

    await expect(fetchDraft(League.NFL)).rejects.toThrow('unknown failure')
  })

  test('fetchDraft handles null rejection', async () => {
    axios.get = jest.fn().mockRejectedValue(null)

    await expect(fetchDraft(League.NFL)).rejects.toThrow(
      'An unknown error occurred while fetching draft data'
    )
  })
})
