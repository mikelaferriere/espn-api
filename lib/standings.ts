/** Module that aggregates per-team standings by fetching team details
 *
 * Combines data from the teams module to produce sorted standings
 * with parsed records (wins, losses, ties) and win percentage.
 *
 */

import * as Enums from './definitions/enums'
import { TeamDetail, Record } from './definitions/types'
import { fetchTeams, fetchTeam } from './teams'

export interface TeamStanding {
  team: TeamDetail
  record: Record
  standingSummary: string
  wins: number
  losses: number
  ties?: number
  percentage: string
}

const parseRecordSummary = (
  summary: string
): { wins: number; losses: number; ties: number | undefined } => {
  const parts = summary.split('-').map(Number)

  const wins = parts[0] ?? 0
  const losses = parts[1] ?? 0
  const ties = parts.length >= 3 ? parts[2] : undefined

  return { wins, losses, ties }
}

const calculatePercentage = (
  wins: number,
  losses: number,
  ties: number | undefined
): string => {
  const totalGames = wins + losses + (ties ?? 0)
  if (totalGames === 0) return '.000'
  return (wins / totalGames).toFixed(3).replace(/^0/, '')
}

/**
 * Fetch standings for all teams in a league, sorted by wins descending
 * @param {Enums.League} league - The league
 * @returns {Promise<TeamStanding[]>}
 * @example
 * ```typescript
 * import { Standings, Enums } from '@mikelaferriere/espn-api';
 *
 * const standings = await Standings.fetchStandings(Enums.League.NFL);
 * console.log(standings[0].team.displayName); // Team with most wins
 * ```
 */
export const fetchStandings = async (
  league: Enums.League
): Promise<TeamStanding[]> => {
  try {
    const teamsResponse = await fetchTeams(league)

    const teamEntries = teamsResponse.sports[0].leagues[0].teams

    const teamDetails = await Promise.all(
      teamEntries.map((entry) => fetchTeam(league, entry.team.id))
    )

    const standings: TeamStanding[] = teamDetails.map((team) => {
      const { wins, losses, ties } = parseRecordSummary(team.record.summary)
      const percentage = calculatePercentage(wins, losses, ties)

      return {
        team,
        record: team.record,
        standingSummary: team.standingSummary,
        wins,
        losses,
        ...(ties !== undefined && { ties }),
        percentage,
      }
    })

    standings.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      return parseFloat(b.percentage) - parseFloat(a.percentage)
    })

    return standings
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'An unknown error occurred while fetching standings data'
    throw new Error(message)
  }
}
