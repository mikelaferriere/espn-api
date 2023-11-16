/** Module that describes and implements the 'Scoreboard' for a given sports league
 *
 * Full Days Scoreboard  : https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard
 *
 */

import axios from 'axios'
import { getTeam } from './utils'
import { BaseScoreboard, SportingEvent } from '../types'

const mapToScoreboard = (data: Record<string, any>): BaseScoreboard => {
  const { leagues, events } = data

  return {
    id: leagues[0].id,
    name: leagues[0].name,
    slug: leagues[0].slug,
    abbreviation: leagues[0].abbreviation,
    events: events.map((event: any): SportingEvent => {
      return {
        id: event.id,
        name: event.name,
        shortName: event.shortName,
        awayTeam: getTeam(event.competitions[0].competitors, 'away'),
        homeTeam: getTeam(event.competitions[0].competitors, 'home'),
      }
    }),
  }
}

/**
 * Fetch raw scoreboard data for the NHL
 *
 * @returns {Promise<BaseScoreboard>}
 */
export const fetchRawNHLScoreboard = (): Promise<BaseScoreboard> => {
  return axios
    .get('https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard')
    .then(({ data }) => mapToScoreboard(data))
}

/**
 * Fetch raw scoreboard data for the NFL
 *
 * @returns {Promise<BaseScoreboard>}
 */
export const fetchRawNFLScoreboard = (): Promise<BaseScoreboard> => {
  return axios
    .get(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'
    )
    .then(({ data }) => mapToScoreboard(data))
}

/**
 * Fetch raw scoreboard data for the MLB
 *
 * @returns {Promise<BaseScoreboard>}
 */
export const fetchRawMLBScoreboard = (): Promise<BaseScoreboard> => {
  return axios
    .get(
      'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard'
    )
    .then(({ data }) => mapToScoreboard(data))
}
