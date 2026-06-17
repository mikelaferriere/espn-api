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
    case Enums.League.NCAAF:
      return 'football/college-football'
    case Enums.League.NCAAB:
      return 'basketball/mens-college-basketball'
    case Enums.League.MLS:
      return 'soccer/usa.1'
    case Enums.League.WORLD_CUP:
      return 'soccer/fifa.world'
    case Enums.League.EUROS:
      return 'soccer/uefa.euro'
    case Enums.League.CHAMPIONS_LEAGUE:
      return 'soccer/uefa.champions'
    default:
      throw Error(`League (${String(league)}) not supported`)
  }
}
