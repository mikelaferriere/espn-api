# ESPN API Expansion — Learnings

## Roster Module (Task 8)

- **Module pattern**: Simple exported function with axios, enumToUrlString, proper error extraction. No classes.
- **Error handling**: Use scoreboard.ts pattern (3-branch: `instanceof Error`, `typeof === 'string'`, fallback message). NOT the summary.ts pattern (`throw new Error(error)`) which is buggy.
- **Roster endpoint**: `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/teams/${teamId}/roster`
- **RosterResponse shape**: `{ athletes: AthleteDetail[], coach: Coach }` — flat structure, not nested under `sports/leagues`.
- **Fixtures**: Keep under 5KB. 3-5 athletes is sufficient for test coverage. Real responses are ~213KB.
- **Test pattern**: `jest.mock('axios')`, `beforeEach(resetAllMocks)`, mock `axios.get` with fixture JSON, test fields individually.
- **Pre-existing test failures**: scoreboard tests have 2 pre-existing failures (NBA expected fixture outdated, error handling test for non-Error objects). Not related to roster module.

## News Module (Task 11)

- **News endpoint**: `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/news` with optional `?limit=N` query param.
- **Options pattern**: Simple `{ limit?: number }` options object. Only append query string when limit is explicitly provided.
- **NewsResponse shape**: `{ articles: [...] }` — each article has id, description, type, story, headline, shortHeadline, byline, published, lastModified, links, images, categories.
- **Test coverage**: 8 tests covering: article structure validation, limit option URL construction, base URL verification, error handling (Error instance, string rejection, unknown object), multi-league URL construction, and full NewsResponse type shape validation.
- **Coverage**: 100% statements, branches, functions, lines for news.ts.
- **Pre-existing failures**: scoreboard.test.ts still has 2 failures (NBA fixture mismatch, error handling). Not related to news module.

## Injuries Module (Task 10)

- **Injuries endpoint**: `https://site.api.espn.com/apis/site/v2/sports/${leagueUrlString}/injuries` — returns ALL teams' injuries (~7.7MB raw for NFL). No server-side pagination/filtering.
- **Client-side filtering**: When `teamId` is provided, filter `sports[0].leagues[0].teams` array to match only that team. When `limit` is provided, slice each team's `injuries` array.
- **Deep clone**: Used `JSON.parse(JSON.stringify(data))` to avoid mutating the cached mock response (important since tests reuse the same fixture).
- **InjuriesResponse shape**: Nested under `sports[].leagues[].teams[]` where each team entry has `{ team: Team, injuries: Injury[] }`.
- **Options pattern**: Exported `InjuriesOptions` interface with optional `teamId` and `limit` fields. Both applied client-side after fetching full response.
- **Test coverage**: 10 tests — full list, teamId filter, teamId+limit, limit-only, empty match, 3 error types, URL construction for 2 leagues. 100% coverage on all metrics.
- **Pre-existing failures**: scoreboard.test.ts (NBA fixture mismatch), teams.test.ts (Patriots fixture + non-Error test). Not related to injuries module.

## Teams Module (Task 7)

- **Two endpoints**: Team list (`/teams`) returns full `TeamsResponse`, team detail (`/teams/${teamId}`) also returns `TeamsResponse` shape but with single team — must extract `data.sports[0].leagues[0].teams[0].team` to return `TeamDetail`.
- **Pagination**: Simple `?limit=N&page=P` query params. Use `buildQueryString` helper similar to scoreboard's pattern.
- **JSON import gotcha**: `import * as x from 'file.json'` wraps content in `{ default: ... }`. Use `import x from 'file.json'` (default import) for direct object comparison with `toStrictEqual`.
- **Error handling**: 3-branch pattern from scoreboard.ts. String rejections produce string as message (not "unknown error"). Object/unknown rejections produce fallback message.
- **Fixtures**: 2 teams per league is sufficient. NFL + NCAAF covers pro and college. Keep venue, record, groups, logos minimal.
- **Coverage**: 100% statements/functions/lines, 81.25% branches (uncovered: string/unknown fallback branches in error handlers).
- **Pre-existing failures**: scoreboard.test.ts still has NBA fixture mismatch. Not related to teams module.

## Scoreboard Module — Enhanced (Task 6)

- **ScoreboardOptions**: Added optional second param to `fetch()`. Fields: `dates`, `week`, `year`, `seasontype`, `limit`. All optional. Interface already existed in `types.ts` (lines 520-526).
- **Query string builder**: Local `buildQueryString()` function builds `?key=value&key=value` from options. Returns empty string when no options or all fields undefined. Uses `!== undefined` checks (not truthy) so `limit=0` or `week=0` would still be included.
- **Error handling fix**: Replaced `throw new Error(error)` with proper 4-branch: (1) `instanceof Error` → `.message`, (2) object with `.message` property → extract it, (3) string → use directly, (4) fallback message.
- **Backward compatibility**: `fetch(League.NFL)` still works — `options` is optional, empty options produce no query params.
- **JSON import gotcha confirmed**: `import * as nbaJson from 'nba.json'` adds `default` key wrapping the content. Expected fixture files must include this `default` property. Generated with `node -e` script: `{ ...raw, default: { ...raw } }`.
- **NBA fixture**: Created minimal NBA fixture with 1 game (Lakers @ Thunder). Expected file auto-generated.
- **Test coverage**: 14 tests total (3 original + 7 query param + 2 error handling + 2 NBA). 100% statements/functions/lines on scoreboard.ts.

## Playoffs Module (Task 9)

- **Pure functions pattern**: `getSeasonPhase`, `isPlayoffs`, `getSeriesStatus` are pure — no mocking needed in tests, just call with test data objects.
- **Season phase mapping**: Simple switch statement mapping `season.type` (1-4) to `SeasonPhase` enum. Unknown types throw `Error` with the type value.
- **Series status extraction**: `Series.competitors` is an array of 0-2 elements. Leader/trailer are null when tied, empty, or single competitor. Best-of-N = `totalCompetitions`.
- **Convenience wrapper pattern**: `fetchPlayoffGames` is a thin wrapper over `fetchScoreboard` with `{ year, seasontype: 3 }`. Mock the scoreboard module (not axios) for testing.
- **Mock pattern for convenience wrappers**: `jest.mock('../lib/scoreboard')` then `(fetchScoreboard.fetch as jest.Mock).mockResolvedValue(...)`. Import as `import * as fetchScoreboard from '../lib/scoreboard'`.
- **Test helper**: `makeSeries(overrides)` factory pattern for creating Series test fixtures with sensible defaults.
- **Coverage**: 100% statements/functions/lines. 84.21% branches (uncovered: second competitor having more wins paths — test only covers first-competitor-leads case for trailing).
