import { Team } from './types'

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
