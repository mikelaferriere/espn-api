/** Module that gets specific game details for a given event
 *
 * Specific game details : https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/summary?event=401559470
 *
 */

import axios from 'axios'
import { getTeam } from './utils'
import { Play, GameDetails } from '../index'

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
 * @param {string} eventId - The event ID
 * @returns {Promise<GameDetails>}
 */
export const fetchNHLGameDetails = (eventId: string): Promise<GameDetails> => {
  return axios
    .get(
      `https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/summary?event=${eventId}`
    )
    .then(({ data }) => {
      return {
        homeTeam: getTeam(data.header.competitions[0].competitors, 'home'),
        awayTeam: getTeam(data.header.competitions[0].competitors, 'away'),
        plays: data.plays.map(mapToPlay),
      }
    })
}

/**
 * Fetch and return the game details for a given event
 * @param {string} eventId - The event ID
 * @returns {Promise<GameDetails>}
 */
export const fetchMLBGameDetails = (eventId: string): Promise<GameDetails> => {
  return axios
    .get(
      `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary?event=${eventId}`
    )
    .then(({ data }) => {
      return {
        homeTeam: getTeam(data.header.competitions[0].competitors, 'home'),
        awayTeam: getTeam(data.header.competitions[0].competitors, 'away'),
        plays: data.plays.map(mapToPlay),
      }
    })
}

/**
 * Fetch and return the game details for a given event
 * @param {string} eventId - The event ID
 * @returns {Promise<GameDetails>}
 */
export const fetchNFLGameDetails = (eventId: string): Promise<GameDetails> => {
  return axios
    .get(
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${eventId}`
    )
    .then(({ data }) => {
      return {
        homeTeam: getTeam(data.header.competitions[0].competitors, 'home'),
        awayTeam: getTeam(data.header.competitions[0].competitors, 'away'),
        plays: data.plays?.map(mapToPlay),
      }
    })
}
