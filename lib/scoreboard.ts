/** Module that describes and implements the 'Scoreboard' for a given sports league
 *
 * Full Days Scoreboard  : https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard
 *
 */

import axios from 'axios'
import { enumToUrlString } from './utils'
import { BaseScoreboard, LeagueEnum } from './types'

/**
 * Fetch scoreboard data for a given League
 * @param {LeagueEnum} league
 * @returns {Promise<BaseScoreboard>}
 */
export const fetchScoreboard = (
  league: LeagueEnum
): Promise<BaseScoreboard> => {
  const leagueUrlString = enumToUrlString(league)

  return axios
    .get<BaseScoreboard>(
      `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/scoreboard`
    )
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error)
    })
}
