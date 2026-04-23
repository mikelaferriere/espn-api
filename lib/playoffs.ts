/** Module that provides playoff helpers for season phase detection,
 *  playoff checking, series status extraction, and convenience fetching.
 */

import * as Enums from './definitions/enums'
import { Series, BaseScoreboard } from './definitions/types'
import { fetch as fetchScoreboard } from './scoreboard'

/**
 * Detect the season phase from a season object's type value.
 * @param {object} season - Object with a numeric `type` property
 * @returns {Enums.SeasonPhase} The corresponding SeasonPhase enum value
 * @throws {Error} If the season type is not a recognized value (1-4)
 */
export const getSeasonPhase = (
  season: { type: number }
): Enums.SeasonPhase => {
  switch (season.type) {
    case 1:
      return Enums.SeasonPhase.Preseason
    case 2:
      return Enums.SeasonPhase.Regular
    case 3:
      return Enums.SeasonPhase.Postseason
    case 4:
      return Enums.SeasonPhase.Offseason
    default:
      throw new Error(`Unknown season type: ${season.type}`)
  }
}

/**
 * Check if the season is currently in playoffs (Postseason).
 * @param {object} season - Object with a numeric `type` property
 * @returns {boolean} True if season type is Postseason (3)
 */
export const isPlayoffs = (season: { type: number }): boolean => {
  return season.type === Enums.SeasonPhase.Postseason
}

/** Status of a playoff series, including leader/trailer info */
export interface SeriesStatus {
  completed: boolean
  totalGames: number
  leader: { id: string; wins: number } | null
  trailer: { id: string; wins: number } | null
  isBestOf: number
}

/**
 * Extract series status from Series data.
 * @param {Series} series - The series data from ESPN API
 * @returns {SeriesStatus} Extracted status with leader/trailer information
 */
export const getSeriesStatus = (series: Series): SeriesStatus => {
  const competitors = series.competitors ?? []
  const leader =
    competitors.length === 2 && competitors[0].wins !== competitors[1].wins
      ? competitors[0].wins > competitors[1].wins
        ? { id: competitors[0].id, wins: competitors[0].wins }
        : { id: competitors[1].id, wins: competitors[1].wins }
      : null
  const trailer =
    competitors.length === 2 && competitors[0].wins !== competitors[1].wins
      ? competitors[0].wins < competitors[1].wins
        ? { id: competitors[0].id, wins: competitors[0].wins }
        : { id: competitors[1].id, wins: competitors[1].wins }
      : null

  return {
    completed: series.completed,
    totalGames: series.totalCompetitions,
    leader,
    trailer,
    isBestOf: series.totalCompetitions,
  }
}

/**
 * Convenience function to fetch all playoff games for a given league and year.
 * @param {Enums.League} league - The league to fetch playoff games for
 * @param {number} year - The year to fetch playoff games for
 * @returns {Promise<BaseScoreboard>} The playoff scoreboard data
 */
export const fetchPlayoffGames = (
  league: Enums.League,
  year: number
): Promise<BaseScoreboard> => {
  return fetchScoreboard(league, { year, seasontype: 3 })
}
