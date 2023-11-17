import { fetchScoreboard } from '../lib/scoreboard';
import { League } from '../lib/types';

const league = League.NHL;

fetchScoreboard(league)
  .then(console.dir);