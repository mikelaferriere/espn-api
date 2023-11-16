import axios from 'axios'
import {
  fetchRawMLBScoreboard,
  fetchRawNFLScoreboard,
  fetchRawNHLScoreboard,
} from '../lib/scoreboard'

import * as mlbJson from './data/scoreboard/mlb.json'
import * as nflJson from './data/scoreboard/nfl.json'
import * as nhlJson from './data/scoreboard/nhl.json'

jest.mock('axios')

beforeEach(() => {
  jest.resetAllMocks()
})

describe('scoreboard module', () => {
  test('mlb parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mlbJson })

    const actual = await fetchRawMLBScoreboard()
    expect(actual).toStrictEqual({
      abbreviation: 'MLB',
      events: [
        {
          awayTeam: {
            abbreviation: 'TEX',
            displayName: 'Texas Rangers',
            id: '13',
            location: 'Texas',
            logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/scoreboard/tex.png',
            name: 'Rangers',
            shortDisplayName: 'Rangers',
          },
          homeTeam: {
            abbreviation: 'ARI',
            displayName: 'Arizona Diamondbacks',
            id: '29',
            location: 'Arizona',
            logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/scoreboard/ari.png',
            name: 'Diamondbacks',
            shortDisplayName: 'Diamondbacks',
          },
          id: '401581097',
          name: 'Texas Rangers at Arizona Diamondbacks',
          shortName: 'TEX @ ARI',
        },
      ],
      id: '10',
      name: 'Major League Baseball',
      slug: 'mlb',
    })
  })

  test('nhl parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nhlJson })

    const actual = await fetchRawNHLScoreboard()
    expect(actual).toStrictEqual({
      abbreviation: 'NHL',
      events: [
        {
          awayTeam: {
            abbreviation: 'PHI',
            displayName: 'Philadelphia Flyers',
            id: '15',
            location: 'Philadelphia',
            logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/phi.png',
            name: 'Flyers',
            shortDisplayName: 'Flyers',
          },
          homeTeam: {
            abbreviation: 'CAR',
            displayName: 'Carolina Hurricanes',
            id: '7',
            location: 'Carolina',
            logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/car.png',
            name: 'Hurricanes',
            shortDisplayName: 'Hurricanes',
          },
          id: '401559471',
          name: 'Philadelphia Flyers at Carolina Hurricanes',
          shortName: 'PHI @ CAR',
        },
        {
          awayTeam: {
            abbreviation: 'SEA',
            displayName: 'Seattle Kraken',
            id: '124292',
            location: 'Seattle',
            logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/sea.png',
            name: 'Kraken',
            shortDisplayName: 'Kraken',
          },
          homeTeam: {
            abbreviation: 'EDM',
            displayName: 'Edmonton Oilers',
            id: '6',
            location: 'Edmonton',
            logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/edm.png',
            name: 'Oilers',
            shortDisplayName: 'Oilers',
          },
          id: '401559472',
          name: 'Seattle Kraken at Edmonton Oilers',
          shortName: 'SEA @ EDM',
        },
        {
          awayTeam: {
            abbreviation: 'ANA',
            displayName: 'Anaheim Ducks',
            id: '25',
            location: 'Anaheim',
            logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/ana.png',
            name: 'Ducks',
            shortDisplayName: 'Ducks',
          },
          homeTeam: {
            abbreviation: 'COL',
            displayName: 'Colorado Avalanche',
            id: '17',
            location: 'Colorado',
            logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/col.png',
            name: 'Avalanche',
            shortDisplayName: 'Avalanche',
          },
          id: '401559473',
          name: 'Anaheim Ducks at Colorado Avalanche',
          shortName: 'ANA @ COL',
        },
        {
          awayTeam: {
            abbreviation: 'NYI',
            displayName: 'New York Islanders',
            id: '12',
            location: 'New York',
            logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/nyi.png',
            name: 'Islanders',
            shortDisplayName: 'Islanders',
          },
          homeTeam: {
            abbreviation: 'VAN',
            displayName: 'Vancouver Canucks',
            id: '22',
            location: 'Vancouver',
            logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/van.png',
            name: 'Canucks',
            shortDisplayName: 'Canucks',
          },
          id: '401559474',
          name: 'New York Islanders at Vancouver Canucks',
          shortName: 'NYI @ VAN',
        },
      ],
      id: '90',
      name: 'National Hockey League',
      slug: 'nhl',
    })
  })

  test('nfl parsing happy path', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: nflJson })

    const actual = await fetchRawNFLScoreboard()
    expect(actual).toStrictEqual({
      abbreviation: 'NFL',
      events: [
        {
          awayTeam: {
            abbreviation: 'CIN',
            displayName: 'Cincinnati Bengals',
            id: '4',
            location: 'Cincinnati',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cin.png',
            name: 'Bengals',
            shortDisplayName: 'Bengals',
          },
          homeTeam: {
            abbreviation: 'BAL',
            displayName: 'Baltimore Ravens',
            id: '33',
            location: 'Baltimore',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/bal.png',
            name: 'Ravens',
            shortDisplayName: 'Ravens',
          },
          id: '401547538',
          name: 'Cincinnati Bengals at Baltimore Ravens',
          shortName: 'CIN @ BAL',
        },
        {
          awayTeam: {
            abbreviation: 'PIT',
            displayName: 'Pittsburgh Steelers',
            id: '23',
            location: 'Pittsburgh',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/pit.png',
            name: 'Steelers',
            shortDisplayName: 'Steelers',
          },
          homeTeam: {
            abbreviation: 'CLE',
            displayName: 'Cleveland Browns',
            id: '5',
            location: 'Cleveland',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cle.png',
            name: 'Browns',
            shortDisplayName: 'Browns',
          },
          id: '401547539',
          name: 'Pittsburgh Steelers at Cleveland Browns',
          shortName: 'PIT @ CLE',
        },
        {
          awayTeam: {
            abbreviation: 'CHI',
            displayName: 'Chicago Bears',
            id: '3',
            location: 'Chicago',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/chi.png',
            name: 'Bears',
            shortDisplayName: 'Bears',
          },
          homeTeam: {
            abbreviation: 'DET',
            displayName: 'Detroit Lions',
            id: '8',
            location: 'Detroit',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/det.png',
            name: 'Lions',
            shortDisplayName: 'Lions',
          },
          id: '401547546',
          name: 'Chicago Bears at Detroit Lions',
          shortName: 'CHI @ DET',
        },
        {
          awayTeam: {
            abbreviation: 'LAC',
            displayName: 'Los Angeles Chargers',
            id: '24',
            location: 'Los Angeles',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lac.png',
            name: 'Chargers',
            shortDisplayName: 'Chargers',
          },
          homeTeam: {
            abbreviation: 'GB',
            displayName: 'Green Bay Packers',
            id: '9',
            location: 'Green Bay',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/gb.png',
            name: 'Packers',
            shortDisplayName: 'Packers',
          },
          id: '401547547',
          name: 'Los Angeles Chargers at Green Bay Packers',
          shortName: 'LAC @ GB',
        },
        {
          awayTeam: {
            abbreviation: 'LV',
            displayName: 'Las Vegas Raiders',
            id: '13',
            location: 'Las Vegas',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lv.png',
            name: 'Raiders',
            shortDisplayName: 'Raiders',
          },
          homeTeam: {
            abbreviation: 'MIA',
            displayName: 'Miami Dolphins',
            id: '15',
            location: 'Miami',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/mia.png',
            name: 'Dolphins',
            shortDisplayName: 'Dolphins',
          },
          id: '401547542',
          name: 'Las Vegas Raiders at Miami Dolphins',
          shortName: 'LV @ MIA',
        },
        {
          awayTeam: {
            abbreviation: 'NYG',
            displayName: 'New York Giants',
            id: '19',
            location: 'New York',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/nyg.png',
            name: 'Giants',
            shortDisplayName: 'Giants',
          },
          homeTeam: {
            abbreviation: 'WSH',
            displayName: 'Washington Commanders',
            id: '28',
            location: 'Washington',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/wsh.png',
            name: 'Commanders',
            shortDisplayName: 'Commanders',
          },
          id: '401547548',
          name: 'New York Giants at Washington Commanders',
          shortName: 'NYG @ WSH',
        },
        {
          awayTeam: {
            abbreviation: 'DAL',
            displayName: 'Dallas Cowboys',
            id: '6',
            location: 'Dallas',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/dal.png',
            name: 'Cowboys',
            shortDisplayName: 'Cowboys',
          },
          homeTeam: {
            abbreviation: 'CAR',
            displayName: 'Carolina Panthers',
            id: '29',
            location: 'Carolina',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/car.png',
            name: 'Panthers',
            shortDisplayName: 'Panthers',
          },
          id: '401547545',
          name: 'Dallas Cowboys at Carolina Panthers',
          shortName: 'DAL @ CAR',
        },
        {
          awayTeam: {
            abbreviation: 'TEN',
            displayName: 'Tennessee Titans',
            id: '10',
            location: 'Tennessee',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ten.png',
            name: 'Titans',
            shortDisplayName: 'Titans',
          },
          homeTeam: {
            abbreviation: 'JAX',
            displayName: 'Jacksonville Jaguars',
            id: '30',
            location: 'Jacksonville',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/jax.png',
            name: 'Jaguars',
            shortDisplayName: 'Jaguars',
          },
          id: '401547541',
          name: 'Tennessee Titans at Jacksonville Jaguars',
          shortName: 'TEN @ JAX',
        },
        {
          awayTeam: {
            abbreviation: 'ARI',
            displayName: 'Arizona Cardinals',
            id: '22',
            location: 'Arizona',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ari.png',
            name: 'Cardinals',
            shortDisplayName: 'Cardinals',
          },
          homeTeam: {
            abbreviation: 'HOU',
            displayName: 'Houston Texans',
            id: '34',
            location: 'Houston',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/hou.png',
            name: 'Texans',
            shortDisplayName: 'Texans',
          },
          id: '401547540',
          name: 'Arizona Cardinals at Houston Texans',
          shortName: 'ARI @ HOU',
        },
        {
          awayTeam: {
            abbreviation: 'TB',
            displayName: 'Tampa Bay Buccaneers',
            id: '27',
            location: 'Tampa Bay',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/tb.png',
            name: 'Buccaneers',
            shortDisplayName: 'Buccaneers',
          },
          homeTeam: {
            abbreviation: 'SF',
            displayName: 'San Francisco 49ers',
            id: '25',
            location: 'San Francisco',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sf.png',
            name: '49ers',
            shortDisplayName: '49ers',
          },
          id: '401547549',
          name: 'Tampa Bay Buccaneers at San Francisco 49ers',
          shortName: 'TB @ SF',
        },
        {
          awayTeam: {
            abbreviation: 'NYJ',
            displayName: 'New York Jets',
            id: '20',
            location: 'New York',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/nyj.png',
            name: 'Jets',
            shortDisplayName: 'Jets',
          },
          homeTeam: {
            abbreviation: 'BUF',
            displayName: 'Buffalo Bills',
            id: '2',
            location: 'Buffalo',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/buf.png',
            name: 'Bills',
            shortDisplayName: 'Bills',
          },
          id: '401547543',
          name: 'New York Jets at Buffalo Bills',
          shortName: 'NYJ @ BUF',
        },
        {
          awayTeam: {
            abbreviation: 'SEA',
            displayName: 'Seattle Seahawks',
            id: '26',
            location: 'Seattle',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png',
            name: 'Seahawks',
            shortDisplayName: 'Seahawks',
          },
          homeTeam: {
            abbreviation: 'LAR',
            displayName: 'Los Angeles Rams',
            id: '14',
            location: 'Los Angeles',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lar.png',
            name: 'Rams',
            shortDisplayName: 'Rams',
          },
          id: '401547544',
          name: 'Seattle Seahawks at Los Angeles Rams',
          shortName: 'SEA @ LAR',
        },
        {
          awayTeam: {
            abbreviation: 'MIN',
            displayName: 'Minnesota Vikings',
            id: '16',
            location: 'Minnesota',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/min.png',
            name: 'Vikings',
            shortDisplayName: 'Vikings',
          },
          homeTeam: {
            abbreviation: 'DEN',
            displayName: 'Denver Broncos',
            id: '7',
            location: 'Denver',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/den.png',
            name: 'Broncos',
            shortDisplayName: 'Broncos',
          },
          id: '401547550',
          name: 'Minnesota Vikings at Denver Broncos',
          shortName: 'MIN @ DEN',
        },
        {
          awayTeam: {
            abbreviation: 'PHI',
            displayName: 'Philadelphia Eagles',
            id: '21',
            location: 'Philadelphia',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/phi.png',
            name: 'Eagles',
            shortDisplayName: 'Eagles',
          },
          homeTeam: {
            abbreviation: 'KC',
            displayName: 'Kansas City Chiefs',
            id: '12',
            location: 'Kansas City',
            logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/kc.png',
            name: 'Chiefs',
            shortDisplayName: 'Chiefs',
          },
          id: '401547345',
          name: 'Philadelphia Eagles at Kansas City Chiefs',
          shortName: 'PHI @ KC',
        },
      ],
      id: '28',
      name: 'National Football League',
      slug: 'nfl',
    })
  })
})
