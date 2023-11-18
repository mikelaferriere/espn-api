/** Module that describes and implements the 'Scoreboard' for a given sports league
 *
 * Full Days Scoreboard  : https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard
 *
 */

import axios from 'axios'
import { enumToUrlString } from './utils'
import { BaseScoreboard } from './definitions/types'
import * as Enums from './definitions/enums'

/**
 * Fetch scoreboard data for a given League
 * @param {LeagueEnum} league
 * @returns {Promise<BaseScoreboard>}
 */
export const fetch = (
  league: Enums.League
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
