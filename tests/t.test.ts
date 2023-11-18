import { fetchGameDetails } from '../lib/details'
import { fetchScoreboard } from '../lib/scoreboard'

import { LeagueEnum } from '../lib/types'

describe('play module', () => {
  test('happy path', async () => {
    const details = await fetchGameDetails(LeagueEnum.NHL, '401555905')
  })
})