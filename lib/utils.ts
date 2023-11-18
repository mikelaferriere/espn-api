import * as Enums from './definitions/enums'

/**
 * Convert the league enum to the url string
 * @param {Enums.League} - league enum
 * @returns url string
 */
export const enumToUrlString = (league: Enums.League): string => {
  switch (league) {
    case Enums.League.MLB:
      return 'baseball/mlb'
    case Enums.League.NBA:
      return 'basketball/nba'
    case Enums.League.NFL:
      return 'football/nfl'
    case Enums.League.NHL:
      return 'hockey/nhl'
    default:
      throw Error(`Leauge (${String(league)}) not supported`)
  }
}
