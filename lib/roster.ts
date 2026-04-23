/** Module that fetches roster data for a given team
 *
 * Team roster: https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/12/roster
 *
 */

import axios from 'axios'
import { enumToUrlString } from './utils'
import { RosterResponse } from './definitions/types'
import * as Enums from './definitions/enums'

/**
 * Fetch roster data for a given team
 * @param {Enums.League} league - The league
 * @param {string} teamId - The team ID
 * @returns {Promise<RosterResponse>}
 * @example
 * ```typescript
 * import { fetchRoster, Enums } from '@mikelaferriere/espn-api';
 *
 * const roster = await fetchRoster(Enums.League.NFL, '12');
 * console.log(roster.athletes);
 * console.log(roster.coach);
 * ```
 */
export const fetchRoster = (
  league: Enums.League,
  teamId: string
): Promise<RosterResponse> => {
  const leagueUrlString = enumToUrlString(league)

  return axios
    .get<RosterResponse>(
      `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/teams/${teamId}/roster`
    )
    .then(({ data }) => data)
    .catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'An unknown error occurred while fetching roster data'
      throw new Error(message)
    })
}
