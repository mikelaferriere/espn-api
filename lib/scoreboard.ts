/** Module that describes and implements the 'Scoreboard' for a given sports league
 *
 * Full Days Scoreboard  : https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard
 *
 */

import axios from 'axios'
import { enumToUrlString } from './utils'
import { BaseScoreboard, ScoreboardOptions } from './definitions/types'
import * as Enums from './definitions/enums'

const buildQueryString = (options?: ScoreboardOptions): string => {
  if (!options) return ''

  const params: string[] = []

  if (options.dates) params.push(`dates=${options.dates}`)
  if (options.week !== undefined) params.push(`week=${options.week}`)
  if (options.year !== undefined) params.push(`year=${options.year}`)
  if (options.seasontype !== undefined)
    params.push(`seasontype=${options.seasontype}`)
  if (options.limit !== undefined) params.push(`limit=${options.limit}`)

  return params.length > 0 ? `?${params.join('&')}` : ''
}

/**
 * Fetch scoreboard data for a given League
 * @param {LeagueEnum} league
 * @param {ScoreboardOptions} [options] - Optional query parameters for filtering
 * @returns {Promise<BaseScoreboard>}
 * @example
 * ```typescript
 * import { Scoreboard, Enums } from '@mikelaferriere/espn-api';
 *
 * const scoreboard = await Scoreboard.fetch(Enums.League.NHL);
 * console.log(scoreboard);
 *
 * // With options
 * const nflWeek = await Scoreboard.fetch(Enums.League.NFL, { week: 5, year: 2023, seasontype: 2 });
 * const dateRange = await Scoreboard.fetch(Enums.League.MLB, { dates: '20240101-20240131' });
 * ```
 */
export const fetch = (
  league: Enums.League,
  options?: ScoreboardOptions
): Promise<BaseScoreboard> => {
  const leagueUrlString = enumToUrlString(league)
  const queryString = buildQueryString(options)

  return axios
    .get<BaseScoreboard>(
      `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/scoreboard${queryString}`
    )
    .then(({ data }) => data)
    .catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : typeof error === 'string'
              ? error
              : 'An unknown error occurred while fetching scoreboard data'
      throw new Error(message)
    })
}
