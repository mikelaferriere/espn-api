/** Module that fetches team list and team detail data for a given sports league
 *
 * Team list   : https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams
 * Team detail : https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/12
 *
 */

import axios from 'axios'
import { enumToUrlString } from './utils'
import { TeamsResponse, TeamDetail } from './definitions/types'
import * as Enums from './definitions/enums'

const BASE_URL =
  'https://site.api.espn.com/apis/site/v2/sports'

const buildPaginationQueryString = (
  options?: { limit?: number; page?: number }
): string => {
  if (!options) return ''

  const params: string[] = []

  if (options.limit !== undefined) params.push(`limit=${options.limit}`)
  if (options.page !== undefined) params.push(`page=${options.page}`)

  return params.length > 0 ? `?${params.join('&')}` : ''
}

/**
 * Fetch the list of teams for a given league with optional pagination
 * @param {Enums.League} league - The league
 * @param {{ limit?: number; page?: number }} [options] - Optional pagination parameters
 * @returns {Promise<TeamsResponse>}
 * @example
 * ```typescript
 * import { Teams, Enums } from '@mikelaferriere/espn-api';
 *
 * const teams = await Teams.fetchTeams(Enums.League.NFL);
 * console.log(teams);
 *
 * // With pagination
 * const page = await Teams.fetchTeams(Enums.League.NFL, { limit: 25, page: 2 });
 * ```
 */
export const fetchTeams = (
  league: Enums.League,
  options?: { limit?: number; page?: number }
): Promise<TeamsResponse> => {
  const leagueUrlString = enumToUrlString(league)
  const queryString = buildPaginationQueryString(options)

  return axios
    .get<TeamsResponse>(
      `${BASE_URL}/${leagueUrlString}/teams${queryString}`
    )
    .then(({ data }) => data)
    .catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'An unknown error occurred while fetching teams data'
      throw new Error(message)
    })
}

/**
 * Fetch detail for a single team by ID
 * @param {Enums.League} league - The league
 * @param {string} teamId - The team ID
 * @returns {Promise<TeamDetail>}
 * @example
 * ```typescript
 * import { Teams, Enums } from '@mikelaferriere/espn-api';
 *
 * const team = await Teams.fetchTeam(Enums.League.NFL, '12');
 * console.log(team.displayName);
 * ```
 */
export const fetchTeam = (
  league: Enums.League,
  teamId: string
): Promise<TeamDetail> => {
  const leagueUrlString = enumToUrlString(league)

  return axios
    .get<TeamsResponse>(
      `${BASE_URL}/${leagueUrlString}/teams/${teamId}`
    )
    .then(({ data }) => {
      const team = data.sports[0].leagues[0].teams[0].team
      return team
    })
    .catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'An unknown error occurred while fetching team detail'
      throw new Error(message)
    })
}
