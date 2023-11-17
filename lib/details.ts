/** Module that gets specific game details for a given event
 *
 * Specific game details : https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/summary?event=401559470
 *
 */

import axios from 'axios'
import { enumToUrlString, getTeam } from './utils'
import { Play, GameDetails, League } from './types'

const mapToPlay = (data: Record<string, any>): Play => {
  const { id, type, text, awayScore, homeScore, scoringPlay, team } = data
  return {
    id,
    type,
    text,
    awayScore,
    homeScore,
    scoringPlay,
    team: team?.id,
  }
}

/**
 * Fetch and return the game details for a given event
 * @param {League} league - The league
 * @param {string} eventId - The event ID
 * @returns {Promise<GameDetails>}
 */
export const fetchGameDetails = (league: League, eventId: string): Promise<GameDetails> => {
  const leagueUrlString = enumToUrlString(league)

  return axios
    .get(
      `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/summary?event=${eventId}`
    )
    .then(({ data }) => {
      return {
        homeTeam: getTeam(data.header.competitions[0].competitors, 'home'),
        awayTeam: getTeam(data.header.competitions[0].competitors, 'away'),
        plays: data.plays?.map(mapToPlay),
      }
    })
}