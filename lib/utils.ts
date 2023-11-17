import { League, Team } from './types'

/**
 * Convert the league enum to the url string
 * @param league - league enum
 * @returns url string
 */
export const enumToUrlString = (league: League): string => {
  switch (league) {
    case League.MLB:
      return 'baseball/mlb'
    case League.NBA:
      return 'basketball/nba'
    case League.NFL:
      return 'football/nfl'
    case League.NHL:
      return 'hockey/nhl'
    default:
      throw Error(`Leauge (${String(league)}) not supported`)
  }
}

/**
 * From a list of competitors and a home or away team, return the team
 *
 * @param competitors - list of competitors
 *  @param homeOrAway - home or away team
 *  @returns team
 */
export const getTeam = (
  competitors: Record<string, any>[],
  homeOrAway: string
): Team => {
  return competitors
    .filter(({ homeAway }) => homeOrAway === homeAway)
    .map(({ id, team }) => {
      return {
        id,
        name: team.name,
        abbreviation: team.abbreviation,
        displayName: team.displayName,
        shortDisplayName: team.shortDisplayName,
        location: team.location,
        logo: team.logo,
      }
    })[0]
}
