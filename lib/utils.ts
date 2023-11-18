import { LeagueEnum } from './types'

/**
 * Convert the league enum to the url string
 * @param {LeagueEnum} - league enum
 * @returns url string
 */
export const enumToUrlString = (league: LeagueEnum): string => {
  switch (league) {
    case LeagueEnum.MLB:
      return 'baseball/mlb'
    case LeagueEnum.NBA:
      return 'basketball/nba'
    case LeagueEnum.NFL:
      return 'football/nfl'
    case LeagueEnum.NHL:
      return 'hockey/nhl'
    default:
      throw Error(`Leauge (${String(league)}) not supported`)
  }
}
