import axios from 'axios'
import { fetchGameDetails } from '../lib/details'

import * as mlbJson from './data/gameDetails/mlb.json'
import * as nflJson from './data/gameDetails/nfl.json'
import * as nhlJson from './data/gameDetails/nhl.json'
import { LeagueEnum } from '../lib/types'

import fs from 'fs'

jest.mock('axios')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('game details module', () => {
  test('mlb parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mlbJson })

    const actual = await fetchGameDetails(LeagueEnum.MLB, '401581097')
    const expected = fs.readFileSync('tests/data/gameDetails/expectedMlb.json')
    expect(actual).toStrictEqual(JSON.parse(expected.toString()))
  })

  test('nfl parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflJson })

    const actual = await fetchGameDetails(LeagueEnum.NFL, '401547538')
    const expected = fs.readFileSync('tests/data/gameDetails/expectedNfl.json')
    expect(actual).toStrictEqual(JSON.parse(expected.toString()))
  })

  test('nhl parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nhlJson })

    const actual = await fetchGameDetails(LeagueEnum.NHL, '401559471')
    const expected = fs.readFileSync('tests/data/gameDetails/expectedNhl.json')
    expect(actual).toStrictEqual(JSON.parse(expected.toString()))
  })
})
