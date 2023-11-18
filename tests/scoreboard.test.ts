import axios from 'axios'
import { fetchScoreboard } from '../lib/scoreboard'

import * as mlbJson from './data/scoreboard/mlb.json'
import * as nflJson from './data/scoreboard/nfl.json'
import * as nhlJson from './data/scoreboard/nhl.json'

import { LeagueEnum } from '../lib/types'

import fs from 'fs'

jest.mock('axios')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('scoreboard module', () => {
  test('mlb parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mlbJson })

    const actual = await fetchScoreboard(LeagueEnum.MLB)
    const expected = fs.readFileSync('tests/data/scoreboard/expectedMlb.json')

    expect(actual).toStrictEqual(JSON.parse(expected.toString()))
  })

  test('nhl parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nhlJson })

    const actual = await fetchScoreboard(LeagueEnum.NHL)
    const expected = fs.readFileSync('tests/data/scoreboard/expectedNhl.json')

    expect(actual).toStrictEqual(JSON.parse(expected.toString()))
  })

  test('nfl parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflJson })

    const actual = await fetchScoreboard(LeagueEnum.NFL)
    
    const expected = fs.readFileSync('tests/data/scoreboard/expectedNfl.json')

    expect(actual).toStrictEqual(JSON.parse(expected.toString()))

  })
})