/** Module that fetches news/articles for a given sports league
 *
 * NFL News : https://site.api.espn.com/apis/site/v2/sports/football/nfl/news
 *
 */

import axios from 'axios'
import { enumToUrlString } from './utils'
import { NewsResponse } from './definitions/types'
import * as Enums from './definitions/enums'

/**
 * Fetch news articles for a given League
 * @param {LeagueEnum} league - The league
 * @param {Object} [options] - Optional parameters
 * @param {number} [options.limit] - Maximum number of articles to return
 * @returns {Promise<NewsResponse>}
 * @example
 * ```typescript
 * import { fetchNews, Enums } from '@mikelaferriere/espn-api';
 *
 * const news = await fetchNews(Enums.League.NFL);
 * console.log(news.articles);
 *
 * // With limit
 * const limited = await fetchNews(Enums.League.NFL, { limit: 5 });
 * ```
 */
export const fetchNews = (
  league: Enums.League,
  options?: { limit?: number }
): Promise<NewsResponse> => {
  const leagueUrlString = enumToUrlString(league)
  const queryString =
    options?.limit !== undefined ? `?limit=${options.limit}` : ''

  return axios
    .get<NewsResponse>(
      `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/news${queryString}`
    )
    .then(({ data }) => data)
    .catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'An unknown error occurred while fetching news data'
      throw new Error(message)
    })
}
