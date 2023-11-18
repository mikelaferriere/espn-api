/** Module that gets specific game details for a given event
 *
 * Specific game details : https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/summary?event=401559470
 *
 */

import axios from 'axios'
import { enumToUrlString } from './utils'
import { BaseGameDetails, LeagueEnum } from './types'

/**
 * Fetch and return the game details for a given event
 * @param {LeagueEnum} league - The league
 * @param {string} eventId - The event ID
 * @returns {Promise<BaseGameDetails>}
 */
export const fetchGameDetails = (
  league: LeagueEnum,
  eventId: string
): Promise<BaseGameDetails> => {
  const leagueUrlString = enumToUrlString(league)

  return axios
    .get<BaseGameDetails>(
      `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/summary?event=${eventId}`
    )
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error)
    })
}
