/** Module that fetches injury reports for a given sports league
 *
 * Full injuries list : https://site.api.espn.com/apis/site/v2/sports/football/nfl/injuries
 *
 */

import axios from 'axios'
import { enumToUrlString } from './utils'
import { InjuriesResponse } from './definitions/types'
import * as Enums from './definitions/enums'

export interface InjuriesOptions {
  teamId?: string
  limit?: number
}

/**
 * Fetch injury reports for a given League, with optional team filtering
 * @param {League} league - The league to fetch injuries for
 * @param {InjuriesOptions} [options] - Optional filters: teamId to filter by team, limit to cap injuries per team
 * @returns {Promise<InjuriesResponse>}
 * @example
 * ```typescript
 * import { fetchInjuries, Enums } from '@mikelaferriere/espn-api';
 *
 * // All injuries
 * const injuries = await fetchInjuries(Enums.League.NFL);
 *
 * // Filtered by team
 * const patriotsInjuries = await fetchInjuries(Enums.League.NFL, { teamId: '12' });
 *
 * // Filtered + limited
 * const limited = await fetchInjuries(Enums.League.NFL, { teamId: '12', limit: 2 });
 * ```
 */
export const fetchInjuries = (
  league: Enums.League,
  options?: InjuriesOptions
): Promise<InjuriesResponse> => {
  const leagueUrlString = enumToUrlString(league)

  return axios
    .get<InjuriesResponse>(
      `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/injuries`
    )
    .then(({ data }) => {
      if (!options) return data

      const filtered = JSON.parse(JSON.stringify(data)) as InjuriesResponse

      if (options.teamId) {
        filtered.sports = filtered.sports.map((sport) => ({
          ...sport,
          leagues: sport.leagues.map((leagueEntry) => ({
            ...leagueEntry,
            teams: leagueEntry.teams.filter(
              (teamEntry) => teamEntry.team.id === options.teamId
            ),
          })),
        }))
      }

      if (options.limit !== undefined) {
        filtered.sports = filtered.sports.map((sport) => ({
          ...sport,
          leagues: sport.leagues.map((leagueEntry) => ({
            ...leagueEntry,
            teams: leagueEntry.teams.map((teamEntry) => ({
              ...teamEntry,
              injuries: teamEntry.injuries.slice(0, options.limit),
            })),
          })),
        }))
      }

      return filtered
    })
    .catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'An unknown error occurred while fetching injuries data'
      throw new Error(message)
    })
}
