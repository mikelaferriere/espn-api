/** Module that describes and implements the 'Scoreboard' for a given sports league
 *
 * Full Days Scoreboard  : https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard
 *
 */

import axios from 'axios'
import { enumToUrlString, getTeam } from './utils'
import { BaseScoreboard, League, SportingEvent } from './types'

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
 * Fetch scoreboard data for a given League
 * @param {League} league
 * @returns {Promise<BaseScoreboard>}
 */
export const fetchScoreboard = (league: League): Promise<BaseScoreboard> => {
  const leagueUrlString = enumToUrlString(league)

  return axios
     .get(`https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/scoreboard`)
     .then(({ data }) => mapToScoreboard(data))
}