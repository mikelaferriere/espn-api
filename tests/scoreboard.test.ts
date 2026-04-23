import axios from 'axios'
import { fetch } from '../lib/scoreboard'

import * as mlbJson from './data/scoreboard/mlb.json'
import * as nflJson from './data/scoreboard/nfl.json'
import * as nhlJson from './data/scoreboard/nhl.json'
import * as nbaJson from './data/scoreboard/nba.json'

import { League } from '../lib/definitions/enums'

import fs from 'fs'

jest.mock('axios')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('scoreboard module', () => {
  test('mlb parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mlbJson })

    const actual = await fetch(League.MLB)
    const expected = fs.readFileSync('tests/data/scoreboard/expectedMlb.json')

    expect(actual).toStrictEqual(JSON.parse(expected.toString()))
  })

  test('nhl parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nhlJson })

    const actual = await fetch(League.NHL)
    const expected = fs.readFileSync('tests/data/scoreboard/expectedNhl.json')

    expect(actual).toStrictEqual(JSON.parse(expected.toString()))
  })

  test('nfl parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflJson })

    const actual = await fetch(League.NFL)
    
    const expected = fs.readFileSync('tests/data/scoreboard/expectedNfl.json')

    expect(actual).toStrictEqual(JSON.parse(expected.toString()))

  })
})

describe('scoreboard query parameters', () => {
  test('fetch with no options has no query params', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mlbJson })

    await fetch(League.MLB)

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard'
    )
  })

  test('fetch with dates param includes dates in URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mlbJson })

    await fetch(League.MLB, { dates: '20240101' })

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=20240101'
    )
  })

  test('fetch with date range includes dates range in URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mlbJson })

    await fetch(League.MLB, { dates: '20240101-20240131' })

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=20240101-20240131'
    )
  })

  test('fetch with football params (week, year, seasontype)', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflJson })

    await fetch(League.NFL, { week: 5, year: 2023, seasontype: 2 })

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=5&year=2023&seasontype=2'
    )
  })

  test('fetch with seasontype 3 for playoff games', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflJson })

    await fetch(League.NFL, { seasontype: 3 })

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=3'
    )
  })

  test('fetch with limit param', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mlbJson })

    await fetch(League.MLB, { limit: 25 })

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?limit=25'
    )
  })

  test('fetch with empty options object has no query params', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mlbJson })

    await fetch(League.MLB, {})

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard'
    )
  })
})

describe('scoreboard error handling', () => {
  test('throws meaningful error on network failure', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network Error'))

    await expect(fetch(League.NFL)).rejects.toThrow('Network Error')
  })

  test('throws meaningful error message from axios error response', async () => {
    const axiosError = {
      response: { status: 404, statusText: 'Not Found' },
      message: 'Request failed with status code 404',
    }
    axios.get = jest.fn().mockRejectedValue(axiosError)

    await expect(fetch(League.NFL)).rejects.toThrow(
      'Request failed with status code 404'
    )
  })
})

describe('scoreboard NBA coverage', () => {
  test('nba parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nbaJson })

    const actual = await fetch(League.NBA)
    const expected = fs.readFileSync('tests/data/scoreboard/expectedNba.json')

    expect(actual).toStrictEqual(JSON.parse(expected.toString()))
  })

  test('nba fetch with date options builds correct URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nbaJson })

    await fetch(League.NBA, { dates: '20240115', year: 2024 })

    expect(axios.get).toHaveBeenCalledWith(
      'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20240115&year=2024'
    )
  })
})