import {
  getSeasonPhase,
  isPlayoffs,
  getSeriesStatus,
  fetchPlayoffGames,
} from '../lib/playoffs'
import { SeasonPhase, League } from '../lib/definitions/enums'
import { Series } from '../lib/definitions/types'

import * as fetchScoreboard from '../lib/scoreboard'

jest.mock('../lib/scoreboard')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('getSeasonPhase', () => {
  test('maps type 1 to Preseason', () => {
    expect(getSeasonPhase({ type: 1 })).toBe(SeasonPhase.Preseason)
  })

  test('maps type 2 to Regular', () => {
    expect(getSeasonPhase({ type: 2 })).toBe(SeasonPhase.Regular)
  })

  test('maps type 3 to Postseason', () => {
    expect(getSeasonPhase({ type: 3 })).toBe(SeasonPhase.Postseason)
  })

  test('maps type 4 to Offseason', () => {
    expect(getSeasonPhase({ type: 4 })).toBe(SeasonPhase.Offseason)
  })

  test('throws on unknown type', () => {
    expect(() => getSeasonPhase({ type: 99 })).toThrow(
      'Unknown season type: 99'
    )
  })
})

describe('isPlayoffs', () => {
  test('returns true for Postseason (type 3)', () => {
    expect(isPlayoffs({ type: 3 })).toBe(true)
  })

  test('returns false for Regular (type 2)', () => {
    expect(isPlayoffs({ type: 2 })).toBe(false)
  })

  test('returns false for Preseason (type 1)', () => {
    expect(isPlayoffs({ type: 1 })).toBe(false)
  })

  test('returns false for Offseason (type 4)', () => {
    expect(isPlayoffs({ type: 4 })).toBe(false)
  })
})

describe('getSeriesStatus', () => {
  const makeSeries = (
    overrides: Partial<Series> = {}
  ): Series => ({
    type: 'best-of-7',
    title: 'Western Conference Finals',
    summary: 'Team A wins 4-2',
    completed: false,
    totalCompetitions: 7,
    competitors: [],
    ...overrides,
  })

  test('completed series with clear winner', () => {
    const series = makeSeries({
      completed: true,
      competitors: [
        { id: '1', uid: 's:1~t:1', wins: 4, ties: 0, href: '' },
        { id: '2', uid: 's:1~t:2', wins: 2, ties: 0, href: '' },
      ],
    })

    const status = getSeriesStatus(series)

    expect(status.completed).toBe(true)
    expect(status.totalGames).toBe(7)
    expect(status.isBestOf).toBe(7)
    expect(status.leader).toEqual({ id: '1', wins: 4 })
    expect(status.trailer).toEqual({ id: '2', wins: 2 })
  })

  test('ongoing series with leader', () => {
    const series = makeSeries({
      completed: false,
      totalCompetitions: 7,
      competitors: [
        { id: '10', uid: 's:1~t:10', wins: 2, ties: 0, href: '' },
        { id: '20', uid: 's:1~t:20', wins: 1, ties: 0, href: '' },
      ],
    })

    const status = getSeriesStatus(series)

    expect(status.completed).toBe(false)
    expect(status.totalGames).toBe(7)
    expect(status.leader).toEqual({ id: '10', wins: 2 })
    expect(status.trailer).toEqual({ id: '20', wins: 1 })
  })

  test('tied series returns null leader and trailer', () => {
    const series = makeSeries({
      competitors: [
        { id: '5', uid: 's:1~t:5', wins: 2, ties: 0, href: '' },
        { id: '6', uid: 's:1~t:6', wins: 2, ties: 0, href: '' },
      ],
    })

    const status = getSeriesStatus(series)

    expect(status.leader).toBeNull()
    expect(status.trailer).toBeNull()
  })

  test('empty competitors returns null leader and trailer', () => {
    const series = makeSeries({ competitors: [] })

    const status = getSeriesStatus(series)

    expect(status.leader).toBeNull()
    expect(status.trailer).toBeNull()
    expect(status.totalGames).toBe(7)
    expect(status.completed).toBe(false)
  })

  test('single competitor returns null leader and trailer', () => {
    const series = makeSeries({
      competitors: [
        { id: '1', uid: 's:1~t:1', wins: 3, ties: 0, href: '' },
      ],
    })

    const status = getSeriesStatus(series)

    expect(status.leader).toBeNull()
    expect(status.trailer).toBeNull()
  })

  test('best-of-5 series', () => {
    const series = makeSeries({
      totalCompetitions: 5,
      competitors: [
        { id: 'a', uid: 's:1~t:a', wins: 3, ties: 0, href: '' },
        { id: 'b', uid: 's:1~t:b', wins: 1, ties: 0, href: '' },
      ],
    })

    const status = getSeriesStatus(series)

    expect(status.isBestOf).toBe(5)
    expect(status.totalGames).toBe(5)
  })
})

describe('fetchPlayoffGames', () => {
  test('calls fetchScoreboard with year and seasontype 3', async () => {
    const mockResponse = {
      leagues: [],
      season: { year: 2023, type: 3 },
      day: { date: '2023-01-01' },
      events: [],
    }
    ;(fetchScoreboard.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const result = await fetchPlayoffGames(League.NFL, 2023)

    expect(fetchScoreboard.fetch).toHaveBeenCalledWith(League.NFL, {
      year: 2023,
      seasontype: 3,
    })
    expect(result).toEqual(mockResponse)
  })

  test('propagates errors from fetchScoreboard', async () => {
    ;(fetchScoreboard.fetch as jest.Mock).mockRejectedValue(
      new Error('Network Error')
    )

    await expect(fetchPlayoffGames(League.NBA, 2023)).rejects.toThrow(
      'Network Error'
    )
  })
})
