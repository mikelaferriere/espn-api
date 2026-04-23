/** Module that fetches draft pick data for a given sports league
 *
 * NFL Draft : https://site.api.espn.com/apis/site/v2/sports/football/nfl/draft
 *
 */

import axios from 'axios'
import { enumToUrlString } from './utils'
import { DraftResponse } from './definitions/types'
import * as Enums from './definitions/enums'

/**
 * Fetch draft data for a given League
 * @param {Enums.League} league - The league to fetch draft data for
 * @param {Object} [options] - Optional parameters
 * @param {number} [options.year] - Draft year
 * @param {number} [options.limit] - Maximum number of results
 * @returns {Promise<DraftResponse>}
 * @example
 * ```typescript
 * import { Draft, Enums } from '@mikelaferriere/espn-api';
 *
 * const draft = await Draft.fetchDraft(Enums.League.NFL);
 * console.log(draft);
 *
 * // With year
 * const draft2023 = await Draft.fetchDraft(Enums.League.NFL, { year: 2023 });
 * ```
 */
export const fetchDraft = (
  league: Enums.League,
  options?: { year?: number; limit?: number }
): Promise<DraftResponse> => {
  const leagueUrlString = enumToUrlString(league)

  const params: string[] = []
  if (options?.year !== undefined) params.push(`year=${options.year}`)
  if (options?.limit !== undefined) params.push(`limit=${options.limit}`)
  const queryString = params.length > 0 ? `?${params.join('&')}` : ''

  return axios
    .get<DraftResponse>(
      `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/draft${queryString}`
    )
    .then(({ data }) => data)
    .catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'An unknown error occurred while fetching draft data'
      throw new Error(message)
    })
}
