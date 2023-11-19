import * as Summary from '../lib/summary'
import * as Scoreboard from '../lib/scoreboard'

import { League } from '../lib/definitions/enums'

describe('play module', () => {
  test('happy path', async () => {
    const details = await Summary.fetch(League.NHL, '401555905')
  })
})