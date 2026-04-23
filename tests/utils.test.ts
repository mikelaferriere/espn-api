import { League, SeasonPhase } from '../lib/definitions/enums'
import { enumToUrlString } from '../lib/utils'

describe('League enum values', () => {
  test('has all 7 leagues with correct numeric values', () => {
    expect(League.NBA).toBe(0)
    expect(League.MLB).toBe(1)
    expect(League.NFL).toBe(2)
    expect(League.NHL).toBe(3)
    expect(League.NCAAF).toBe(4)
    expect(League.NCAAB).toBe(5)
    expect(League.MLS).toBe(6)
  })
})

describe('SeasonPhase enum values', () => {
  test('has correct numeric values', () => {
    expect(SeasonPhase.Preseason).toBe(1)
    expect(SeasonPhase.Regular).toBe(2)
    expect(SeasonPhase.Postseason).toBe(3)
    expect(SeasonPhase.Offseason).toBe(4)
  })
})

describe('enumToUrlString', () => {
  test('NBA returns basketball/nba', () => {
    expect(enumToUrlString(League.NBA)).toBe('basketball/nba')
  })

  test('MLB returns baseball/mlb', () => {
    expect(enumToUrlString(League.MLB)).toBe('baseball/mlb')
  })

  test('NFL returns football/nfl', () => {
    expect(enumToUrlString(League.NFL)).toBe('football/nfl')
  })

  test('NHL returns hockey/nhl', () => {
    expect(enumToUrlString(League.NHL)).toBe('hockey/nhl')
  })

  test('NCAAF returns football/college-football', () => {
    expect(enumToUrlString(League.NCAAF)).toBe('football/college-football')
  })

  test('NCAAB returns basketball/mens-college-basketball', () => {
    expect(enumToUrlString(League.NCAAB)).toBe('basketball/mens-college-basketball')
  })

  test('MLS returns soccer/usa.1', () => {
    expect(enumToUrlString(League.MLS)).toBe('soccer/usa.1')
  })

  test('throws error with "League" (not "Leauge") for invalid league', () => {
    expect(() => enumToUrlString(99 as unknown as League)).toThrow(/League/)
    expect(() => enumToUrlString(99 as unknown as League)).not.toThrow(/Leauge/)
  })
})
