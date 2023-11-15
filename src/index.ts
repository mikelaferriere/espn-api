import {
  fetchMLBGameDetails,
  fetchNFLGameDetails,
  fetchNHLGameDetails,
} from './details'
import {
  fetchRawNHLScoreboard,
  fetchRawMLBScoreboard,
  fetchRawNFLScoreboard,
} from './scoreboard'

export const helloWorld = () => {
  return 'Hello World'
}

// fetchRawMLBScoreboard().then(console.dir)
// fetchRawNFLScoreboard().then(console.dir)
// fetchRawNHLScoreboard().then(console.dir)

// fetchMLBGameDetails("401581097").then(console.dir)
// fetchNFLGameDetails("1401547345").then(console.dir)
// fetchNHLGameDetails("401559462").then(console.dir)
