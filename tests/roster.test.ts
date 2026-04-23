import axios from 'axios'
import { fetchRoster } from '../lib/roster'

import * as nflRosterJson from './data/roster/nfl-roster-12.json'

import { League } from '../lib/definitions/enums'

jest.mock('axios')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('roster module', () => {
  test('fetchRoster returns athletes and coach', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflRosterJson })

    const result = await fetchRoster(League.NFL, '12')

    expect(result.athletes).toHaveLength(3)
    expect(result.coach).toBeDefined()
    expect(result.coach.fullName).toBe('Mike Vrabel')
  })

  test('fetchRoster returns athletes with correct AthleteDetail fields', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflRosterJson })

    const result = await fetchRoster(League.NFL, '12')
    const qb = result.athletes.find((a) => a.position.abbreviation === 'QB')!

    expect(qb.id).toBe('3139477')
    expect(qb.fullName).toBe('Drake Maye')
    expect(qb.displayName).toBe('Drake Maye')
    expect(qb.shortName).toBe('D. Maye')
    expect(qb.uid).toBe('s:20~l:28~a:3139477')
    expect(qb.headshot.href).toContain('3139477')
    expect(qb.jersey).toBe('10')
    expect(qb.position).toEqual({
      id: '8',
      name: 'Quarterback',
      displayName: 'Quarterback',
      abbreviation: 'QB',
    })
    expect(qb.age).toBe(22)
    expect(qb.dateOfBirth).toBe('2002-04-30')
    expect(qb.weight).toBe(225)
    expect(qb.height).toBe(76)
    expect(qb.experience).toEqual({ years: 1, displayValue: '1st Season' })
    expect(qb.active).toBe(true)
    expect(qb.injuries).toEqual([])
    expect(qb.stats).toEqual([])
  })

  test('fetchRoster returns coach with correct fields', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflRosterJson })

    const result = await fetchRoster(League.NFL, '12')
    const coach = result.coach

    expect(coach.id).toBe('1676')
    expect(coach.uid).toBe('s:20~l:28~a:1676')
    expect(coach.fullName).toBe('Mike Vrabel')
    expect(coach.displayName).toBe('Mike Vrabel')
    expect(coach.firstName).toBe('Mike')
    expect(coach.lastName).toBe('Vrabel')
    expect(coach.experience).toBe(8)
  })

  test('fetchRoster throws meaningful error on failure', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network timeout'))

    await expect(fetchRoster(League.NFL, '12')).rejects.toThrow(
      'Network timeout'
    )
  })

  test('fetchRoster constructs correct URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflRosterJson })

    await fetchRoster(League.NFL, '12')

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/12/roster'
    )
  })
})
